import { useState, useEffect } from 'react'
import { getSecrets, deleteSecret, addSecret, Secret } from '../utils/steam'
import AddSecretModal from '../components/AddSecretModal'
import DeleteConfirmationModal from '../components/DeleteConfirmationModal'

export default function Settings() {
  const [secrets, setSecrets] = useState<Secret[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null)
  const [secretVisibility, setSecretVisibility] = useState<Record<number, boolean>>({})
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean
    index: number
    name: string
  }>({
    isOpen: false,
    index: -1,
    name: '',
  })

  useEffect(() => {
    loadSecrets()
  }, [])

  const loadSecrets = async () => {
    try {
      setLoading(true)
      const loadedSecrets = await getSecrets()
      setSecrets(loadedSecrets)
      // Initialize all secrets as hidden
      const initialVisibility: Record<number, boolean> = {}
      loadedSecrets.forEach((_, index) => {
        initialVisibility[index] = false
      })
      setSecretVisibility(initialVisibility)
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
    // Set new secret as hidden
    setSecretVisibility(prev => ({
      ...prev,
      [updatedSecrets.length - 1]: false,
    }))
    return updatedSecrets
  }

  const confirmDeleteSecret = (index: number) => {
    setDeleteConfirmation({
      isOpen: true,
      index,
      name: secrets[index].name,
    })
  }

  const handleDeleteSecret = async (index: number) => {
    try {
      setIsDeleting(true)
      setDeleteIndex(index)
      const updatedSecrets = await deleteSecret(index)
      setSecrets(updatedSecrets)

      // Update visibility state after deletion
      const newVisibility: Record<number, boolean> = {}
      updatedSecrets.forEach((_, idx) => {
        const oldIdx = idx >= index ? idx + 1 : idx
        newVisibility[idx] = secretVisibility[oldIdx] || false
      })
      setSecretVisibility(newVisibility)
    } catch (error) {
      console.error('Failed to delete secret:', error)
    } finally {
      setIsDeleting(false)
      setDeleteIndex(null)
    }
  }

  const toggleSecretVisibility = (index: number) => {
    setSecretVisibility(prev => ({
      ...prev,
      [index]: !prev[index],
    }))
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
                <div className="flex-1 mr-4">
                  <h4 className="font-medium">{secret.name}</h4>
                  <div className="text-sm text-slate-400 font-mono truncate max-w-xs flex items-center">
                    {secretVisibility[index]
                      ? secret.shared_secret
                      : '•'.repeat(Math.min(secret.shared_secret.length, 24))}
                    <button
                      className="ml-2 text-slate-500 hover:text-slate-300 focus:outline-none"
                      onClick={() => toggleSecretVisibility(index)}
                    >
                      {secretVisibility[index] ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
                <button
                  className="text-red-400 hover:text-red-300 p-2 rounded-full"
                  onClick={() => confirmDeleteSecret(index)}
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

      <DeleteConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        onClose={() => setDeleteConfirmation({ ...deleteConfirmation, isOpen: false })}
        onConfirm={() => handleDeleteSecret(deleteConfirmation.index)}
        name={deleteConfirmation.name}
      />
    </div>
  )
}
