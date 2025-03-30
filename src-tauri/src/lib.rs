// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#![allow(non_snake_case)]

use base64::{engine::general_purpose, Engine as _};
use hmac::{Hmac, Mac};
use serde::{Deserialize, Serialize};
use sha1::Sha1;
use std::fs;
use std::path::PathBuf;
use std::sync::Mutex;
use std::time::{SystemTime, UNIX_EPOCH};
use tauri::{AppHandle, Manager, Runtime};

type HmacSha1 = Hmac<Sha1>;

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Secret {
    pub name: String,
    pub shared_secret: String,
}

#[derive(Serialize, Deserialize, Clone, Debug, Default)]
pub struct Config {
    pub secrets: Vec<Secret>,
}

// Define a state structure to hold config data
struct AppState {
    config: Mutex<Config>,
    config_path: PathBuf,
}

// Function to get config directory
fn get_config_dir() -> PathBuf {
    let mut config_dir = dirs::config_dir().expect("Failed to get config directory");
    config_dir.push("steam-desktop-guard");
    if !config_dir.exists() {
        fs::create_dir_all(&config_dir).expect("Failed to create config directory");
    }
    config_dir
}

// Function to get config file path
fn get_config_path() -> PathBuf {
    let mut config_path = get_config_dir();
    config_path.push("config.json");
    config_path
}

// Function to load config
fn load_config(config_path: &PathBuf) -> Config {
    if config_path.exists() {
        let config_str = fs::read_to_string(config_path).expect("Failed to read config file");
        serde_json::from_str(&config_str).unwrap_or_default()
    } else {
        Config {
            secrets: Vec::new(),
        }
    }
}

// Function to save config
fn save_config(config: &Config, config_path: &PathBuf) {
    let config_str = serde_json::to_string_pretty(config).expect("Failed to serialize config");
    fs::write(config_path, config_str).expect("Failed to write config file");
}

static STEAM_GUARD_CODE_TRANSLATIONS: [u8; 26] = [
    50, 51, 52, 53, 54, 55, 56, 57, 66, 67, 68, 70, 71, 72, 74, 75, 77, 78, 80, 81, 82, 84, 86, 87,
    88, 89,
];

#[tauri::command]
fn get_current_time() -> u64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .expect("Time went backwards")
        .as_secs()
}

#[tauri::command]
fn generate_steam_guard_code(sharedSecret: &str, time: Option<u64>) -> Result<String, String> {
    let time = time.unwrap_or_else(get_current_time);

    // Clean the shared secret (remove whitespace and quotes)
    let cleaned_secret = sharedSecret
        .trim()
        .trim_matches('"')
        .trim_matches('\'')
        .to_string();

    // Unescape and decode base64 shared secret
    let shared_secret_bytes = match general_purpose::STANDARD.decode(cleaned_secret) {
        Ok(bytes) => bytes,
        Err(err) => return Err(format!("Failed to decode Base64: {}", err)),
    };

    // Create time array (8 bytes)
    let time_array = {
        let mut time_value = time / 30; // Divide by 30 seconds
        let mut result = [0u8; 8];

        for i in (0..8).rev() {
            result[i] = (time_value & 0xFF) as u8;
            time_value >>= 8;
        }

        result
    };

    // Calculate HMAC-SHA1
    let mut hmac = match HmacSha1::new_from_slice(&shared_secret_bytes) {
        Ok(hmac) => hmac,
        Err(err) => return Err(format!("Failed to create HMAC instance: {}", err)),
    };

    hmac.update(&time_array);
    let result = hmac.finalize().into_bytes();

    // Generate the code
    let code = {
        let mut code_array = [0u8; 5];

        let b = (result[19] & 0xF) as usize;
        let mut code_point = (((result[b] & 0x7F) as u32) << 24)
            | (((result[b + 1] & 0xFF) as u32) << 16)
            | (((result[b + 2] & 0xFF) as u32) << 8)
            | ((result[b + 3] & 0xFF) as u32);

        for i in 0..5 {
            let index = (code_point % STEAM_GUARD_CODE_TRANSLATIONS.len() as u32) as usize;
            code_array[i] = STEAM_GUARD_CODE_TRANSLATIONS[index];
            code_point /= STEAM_GUARD_CODE_TRANSLATIONS.len() as u32;
        }

        match String::from_utf8(code_array.to_vec()) {
            Ok(code) => code,
            Err(err) => return Err(format!("Failed to convert to UTF-8: {}", err)),
        }
    };

    Ok(code)
}

#[tauri::command]
fn get_secrets<R: Runtime>(app_handle: AppHandle<R>) -> Vec<Secret> {
    let state = app_handle.state::<AppState>();
    let config = state.config.lock().unwrap();
    config.secrets.clone()
}

#[tauri::command]
fn add_secret<R: Runtime>(
    app_handle: AppHandle<R>,
    name: String,
    sharedSecret: String,
) -> Result<Vec<Secret>, String> {
    // Validate the shared secret by attempting to generate a code
    match generate_steam_guard_code(&sharedSecret, None) {
        Ok(_) => {
            let state = app_handle.state::<AppState>();
            let mut config = state.config.lock().unwrap();

            // Add new secret
            config.secrets.push(Secret {
                name,
                shared_secret: sharedSecret,
            });

            // Save config
            save_config(&config, &state.config_path);

            Ok(config.secrets.clone())
        }
        Err(err) => Err(format!("Invalid shared secret: {}", err)),
    }
}

#[tauri::command]
fn delete_secret<R: Runtime>(app_handle: AppHandle<R>, index: usize) -> Vec<Secret> {
    let state = app_handle.state::<AppState>();
    let mut config = state.config.lock().unwrap();

    if index < config.secrets.len() {
        config.secrets.remove(index);
        save_config(&config, &state.config_path);
    }

    config.secrets.clone()
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // Initialize config
    let config_path = get_config_path();
    let config = load_config(&config_path);

    tauri::Builder::default()
        .manage(AppState {
            config: Mutex::new(config),
            config_path,
        })
        .invoke_handler(tauri::generate_handler![
            generate_steam_guard_code,
            get_current_time,
            get_secrets,
            add_secret,
            delete_secret,
        ])
        .setup(|_app| {
            // Any additional setup can go here
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("Error building Tauri application")
}
