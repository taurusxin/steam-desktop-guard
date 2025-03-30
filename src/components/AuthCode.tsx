import { useState } from 'react'
import { useAuthCode } from '../hooks/useAuthCode'
import { clsx } from 'clsx'

interface AuthCodeProps {
  name: string
  sharedSecret: string
}

export default function AuthCode({ name, sharedSecret }: AuthCodeProps) {
  const { code, timeRemaining, progress, copyToClipboard, error } = useAuthCode({ sharedSecret })
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await copyToClipboard()
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative group bg-slate-800 rounded-lg border border-slate-700 p-4 mb-4 transition-all hover:border-slate-600 hover:shadow-md">
      <div className="flex flex-col items-center">
        <h3 className="text-lg font-medium text-slate-300 mb-2">{name}</h3>

        {error ? (
          <div className="w-full mb-2 p-3 bg-red-900/50 border border-red-800 rounded text-red-200 text-sm">
            Error: {error}
          </div>
        ) : null}

        <div
          className="flex items-center justify-center w-full cursor-pointer"
          onClick={handleCopy}
        >
          <div className="relative flex items-center justify-center bg-slate-900 rounded-lg p-4 w-full">
            <code className="font-mono text-3xl tracking-wider text-center">
              {code ? code.split('').join(' ') : '• • • • •'}
            </code>

            {copied && (
              <div className="absolute inset-0 flex items-center justify-center bg-green-900/80 rounded-lg text-white font-medium">
                Copied!
              </div>
            )}
          </div>
        </div>

        <div className="w-full mt-4">
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>Time remaining</span>
            <span>{timeRemaining}s</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
            <div
              className={clsx(
                'h-full rounded-full transition-all',
                progress > 50 ? 'bg-green-500' : progress > 25 ? 'bg-yellow-500' : 'bg-red-500'
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
