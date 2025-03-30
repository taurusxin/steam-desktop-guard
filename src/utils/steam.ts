import { invoke } from '@tauri-apps/api/core'

export interface Secret {
  name: string
  shared_secret: string
}

// Get the current time from the backend
export async function getCurrentTime(): Promise<number> {
  return invoke<number>('get_current_time')
}

// Generate a Steam Guard code
export async function generateSteamGuardCode(sharedSecret: string, time?: number): Promise<string> {
  try {
    return await invoke<string>('generate_steam_guard_code', {
      sharedSecret,
      time,
    })
  } catch (error) {
    console.error('Failed to generate Steam Guard code:', error)
    throw error
  }
}

// Get all saved secrets
export async function getSecrets(): Promise<Secret[]> {
  try {
    return await invoke<Secret[]>('get_secrets')
  } catch (error) {
    console.error('Failed to get secrets:', error)
    return []
  }
}

// Add a new secret
export async function addSecret(name: string, sharedSecret: string): Promise<Secret[]> {
  try {
    return await invoke<Secret[]>('add_secret', {
      name,
      sharedSecret, // Changed to match the parameter name expected by the error message
    })
  } catch (error) {
    console.error('Failed to add secret:', error)
    throw error
  }
}

// Delete a secret by index
export async function deleteSecret(index: number): Promise<Secret[]> {
  try {
    return await invoke<Secret[]>('delete_secret', { index })
  } catch (error) {
    console.error('Failed to delete secret:', error)
    return []
  }
}
