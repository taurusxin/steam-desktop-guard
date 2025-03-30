import React, { useState } from 'react'

interface AddSecretModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (name: string, secret: string) => void
}

export default function AddSecretModal({ isOpen, onClose, onAdd }: AddSecretModalProps) {
  const [name, setName] = useState('')
  const [secret, setSecret] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      setError('Name is required')
      return
    }

    if (!secret.trim()) {
      setError('Secret is required')
      return
    }

    setIsSubmitting(true)
    setError('')

    try {
      await onAdd(name, secret)
      setName('')
      setSecret('')
      onClose()
    } catch (err) {
      // Handle error
      const errorMessage = err instanceof Error ? err.message : 'Failed to add account'
      setError(`Error: ${errorMessage}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-white mb-4">Add New Steam Account</h2>

        <form onSubmit={handleSubmit}>
          {error && (
            <div className="mb-4 p-3 bg-red-900/50 border border-red-800 rounded text-red-200 text-sm">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">
              Account Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full p-2 bg-slate-900 border border-slate-700 rounded text-white"
              placeholder="e.g. Main Account"
              value={name}
              onChange={e => setName(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="secret" className="block text-sm font-medium text-slate-300 mb-1">
              Shared Secret
            </label>
            <input
              type="text"
              id="secret"
              className="w-full p-2 bg-slate-900 border border-slate-700 rounded text-white font-mono"
              placeholder="Enter your shared secret"
              value={secret}
              onChange={e => setSecret(e.target.value)}
              disabled={isSubmitting}
            />
            <p className="mt-1 text-xs text-slate-400">
              This is the base64-encoded shared secret from your Steam account.
            </p>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-600"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 flex items-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Adding...
                </>
              ) : (
                'Add Account'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
