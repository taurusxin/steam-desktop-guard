# Steam Desktop Guard

A simple, cross-platform desktop authenticator for Steam accounts, built with Tauri 2.0 and React.

## Features

- Generate time-based Steam Guard authentication codes
- Modern, clean UI with real-time countdown
- Click to copy codes to clipboard
- Manage multiple Steam accounts
- Local, secure storage of Steam shared secrets

## Development

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [pnpm](https://pnpm.io/)
- [Rust](https://www.rust-lang.org/tools/install)
- [Tauri](https://tauri.app/v2/guides/getting-started/prerequisites)

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/steam-desktop-guard.git
   cd steam-desktop-guard
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Run the development server:
   ```bash
   pnpm run tauri dev
   ```

### Building

To build the app for your platform:

```bash
pnpm run tauri build
```

Or on Windows, you can use the PowerShell script:

```powershell
.\build.ps1
```

## Troubleshooting

### Invalid Base64 Error

If you encounter an error related to invalid Base64 when adding a secret, make sure:
1. The shared secret is copied correctly without extra spaces
2. The shared secret is in the correct format (Base64)
3. Try removing any wrapping quotes if present

### Application Freezes

If the application freezes during startup:
1. Delete the configuration directory at `%APPDATA%\steam-desktop-guard` (Windows) or `~/.config/steam-desktop-guard` (Linux/Mac)
2. Restart the application

### General Issues

For general issues:
1. Check the console for error messages
2. Ensure you're using the latest version of the application
3. Try rebuilding the application from source

## How to Find Your Steam Shared Secret

The shared secret is a unique key associated with your Steam account that is used to generate Steam Guard codes. This is different from your account password and is specific to the Steam Mobile Authenticator.

**Note: Never share your Steam shared secret with anyone!**

To use this application, you'll need to obtain the shared secret from your Steam account. Here are a few methods:

### Method 1: SteamDesktopAuthenticator

1. Download and install [Steam Desktop Authenticator](https://github.com/Jessecar96/SteamDesktopAuthenticator)
2. Follow its instructions to link your Steam account
3. Go to the "Manifest" tab to find your shared secret

### Method 2: From Android (Rooted)

1. On a rooted Android device with Steam app installed
2. Navigate to `/data/data/com.valvesoftware.android.steam.community/files/`
3. Find the file named `Steamguard-[your-steam-id]`
4. Open this file as text and locate the `shared_secret` value

### Method 3: From iOS (Jailbroken)

1. On a jailbroken iOS device with Steam app installed
2. Navigate to `/var/mobile/Containers/Data/Application/[Steam-App-UUID]/Documents/`
3. Find the file named `Steamguard-[your-steam-id]`
4. Open this file as text and locate the `shared_secret` value

The shared secret is typically a Base64 encoded string.

## Security Note

This application stores your shared secrets locally on your device. While we take security seriously, it's important to:

- Keep your system secure with up-to-date antivirus protection
- Do not share your shared secrets with others
- Avoid using this application on shared or public computers

## License

MIT
