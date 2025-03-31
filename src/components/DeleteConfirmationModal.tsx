interface DeleteConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  name: string
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  name,
}: DeleteConfirmationModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 w-full max-w-md">
        <h3 className="text-xl font-semibold mb-4">Delete Account</h3>

        <p className="mb-6 text-slate-300">
          Are you sure you want to delete the account{' '}
          <span className="font-semibold text-white">{name}</span>? This action cannot be undone.
        </p>

        <div className="flex justify-end space-x-3">
          <button
            className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-600"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500"
            onClick={() => {
              onConfirm()
              onClose()
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
