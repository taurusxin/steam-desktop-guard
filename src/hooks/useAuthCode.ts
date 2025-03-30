import { useState, useEffect, useCallback } from 'react'
import { generateSteamGuardCode, getCurrentTime } from '../utils/steam'

interface UseAuthCodeProps {
  sharedSecret: string
}

interface UseAuthCodeResult {
  code: string
  timeRemaining: number
  progress: number
  copyToClipboard: () => Promise<void>
  error: string | null
}

export function useAuthCode({ sharedSecret }: UseAuthCodeProps): UseAuthCodeResult {
  const [code, setCode] = useState<string>('')
  const [timeRemaining, setTimeRemaining] = useState<number>(30)
  const [progress, setProgress] = useState<number>(100)
  const [error, setError] = useState<string | null>(null)

  const updateAuthCode = useCallback(async () => {
    if (!sharedSecret) {
      setError('No shared secret provided')
      return
    }

    try {
      setError(null)
      const currentTime = await getCurrentTime()
      const newCode = await generateSteamGuardCode(sharedSecret)
      setCode(newCode)

      // Calculate time remaining for current code
      const secondsRemaining = 30 - (currentTime % 30)
      setTimeRemaining(secondsRemaining)
      setProgress((secondsRemaining / 30) * 100)
    } catch (error) {
      console.error('Failed to generate auth code:', error)
      setError(error instanceof Error ? error.message : 'Failed to generate auth code')
      setCode('')
    }
  }, [sharedSecret])

  useEffect(() => {
    // Initial auth code generation
    updateAuthCode()

    // Update timer every second
    const timerInterval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // When timer reaches 0, generate a new code
          updateAuthCode()
          return 30
        }
        const newRemaining = prev - 1
        setProgress((newRemaining / 30) * 100)
        return newRemaining
      })
    }, 1000)

    return () => clearInterval(timerInterval)
  }, [updateAuthCode])

  const copyToClipboard = async () => {
    if (!code) {
      setError('No code to copy')
      return
    }

    try {
      await navigator.clipboard.writeText(code)
    } catch (error) {
      console.error('Failed to copy to clipboard:', error)
      setError('Failed to copy to clipboard')
    }
  }

  return { code, timeRemaining, progress, copyToClipboard, error }
}
