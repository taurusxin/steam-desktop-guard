import { useState, useEffect } from 'react'
import { getSecrets, deleteSecret, addSecret, Secret } from '../utils/steam'
import AddSecretModal from '../components/AddSecretModal'

export default function Settings() {
  const [secrets, setSecrets] = useState<Secret[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null)

  useEffect(() => {
    loadSecrets()
  }, [])

  const loadSecrets = async () => {
    try {
      setLoading(true)
      const loadedSecrets = await getSecrets()
      setSecrets(loadedSecrets)
    } catch (error) {
      console.error('Failed to load secrets:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddSecret = async (name: string, sharedSecret: string) => {
    // This will throw if there's an error, which will be caught in AddSecretModal
    const updatedSecrets = await addSecret(name, sharedSecret)
    setSecrets(updatedSecrets)
    return updatedSecrets
  }

  const handleDeleteSecret = async (index: number) => {
    try {
      setIsDeleting(true)
      setDeleteIndex(index)
      const updatedSecrets = await deleteSecret(index)
      setSecrets(updatedSecrets)
    } catch (error) {
      console.error('Failed to delete secret:', error)
    } finally {
      setIsDeleting(false)
      setDeleteIndex(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Settings</h2>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 flex items-center"
          onClick={() => setIsModalOpen(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Add Account
        </button>
      </div>

      <div className="bg-slate-800 rounded-lg border border-slate-700 p-4 mb-6">
        <h3 className="text-lg font-semibold mb-4">Manage Steam Accounts</h3>

        {secrets.length === 0 ? (
          <div className="text-center py-6 text-slate-400">
            No accounts added yet. Click "Add Account" to get started.
          </div>
        ) : (
          <ul className="divide-y divide-slate-700">
            {secrets.map((secret, index) => (
              <li key={index} className="py-3 flex justify-between items-center">
                <div>
                  <h4 className="font-medium">{secret.name}</h4>
                  <div className="text-sm text-slate-400 font-mono truncate max-w-xs">
                    {secret.shared_secret}
                  </div>
                </div>
                <button
                  className="text-red-400 hover:text-red-300 p-2 rounded-full"
                  onClick={() => handleDeleteSecret(index)}
                  disabled={isDeleting}
                >
                  {isDeleting && deleteIndex === index ? (
                    <span className="animate-spin inline-block h-5 w-5 border-t-2 border-red-400 rounded-full"></span>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="bg-slate-800 rounded-lg border border-slate-700 p-4">
        <h3 className="text-lg font-semibold mb-2">About</h3>
        <p className="text-slate-400 text-sm mb-2">
          Steam Desktop Guard is a simple desktop authenticator for Steam accounts.
        </p>
        <p className="text-slate-400 text-sm">Version 0.1.0</p>
      </div>

      <AddSecretModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddSecret}
      />
    </div>
  )
}
