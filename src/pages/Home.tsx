import { useState, useEffect } from 'react'
import AuthCode from '../components/AuthCode'
import AddSecretModal from '../components/AddSecretModal'
import { getSecrets, addSecret, Secret } from '../utils/steam'

export default function Home() {
  const [secrets, setSecrets] = useState<Secret[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const loadSecrets = async () => {
      try {
        const loadedSecrets = await getSecrets()
        setSecrets(loadedSecrets)

        // If no secrets are found, open the modal to add one
        if (loadedSecrets.length === 0) {
          setIsModalOpen(true)
        }
      } catch (error) {
        console.error('Failed to load secrets:', error)
      } finally {
        setLoading(false)
      }
    }

    loadSecrets()
  }, [])

  const handleAddSecret = async (name: string, sharedSecret: string) => {
    // This function is passed to the AddSecretModal and will throw if there's an error
    const updatedSecrets = await addSecret(name, sharedSecret)
    setSecrets(updatedSecrets)
    return updatedSecrets
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {secrets.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)]">
          <div className="text-center max-w-md mx-auto">
            <h2 className="text-xl font-semibold mb-2">No Steam Accounts Added</h2>
            <p className="text-slate-400 mb-6">
              Add your first Steam account by clicking the button below or go to settings.
            </p>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
              onClick={() => setIsModalOpen(true)}
            >
              Add Account
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Your Steam Accounts</h2>
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

          <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
            <div className="grid grid-cols-1 gap-4 pb-4">
              {secrets.map((secret, index) => (
                <AuthCode key={index} name={secret.name} sharedSecret={secret.shared_secret} />
              ))}
            </div>
          </div>
        </div>
      )}

      <AddSecretModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddSecret}
      />
    </div>
  )
}
