import { ActionButton } from '@/components/ActionButton'
import { AnimatePresence, motion } from 'framer-motion'

export function ConfirmModal({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  danger = false,
}: {
  isOpen: boolean
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
  confirmText?: string
  danger?: boolean
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
        >
          <motion.div
            layout
            className="bg-[var(--surface-strong)] p-6 rounded-xl shadow-2xl max-w-sm w-full border border-[var(--line)]"
            initial={{ opacity: 0, y: 12, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 520, damping: 38 }}
          >
            <h3 className="text-lg font-bold mb-2">{title}</h3>
            <p className="text-sm text-[var(--sea-ink-soft)] mb-6">{message}</p>
            <div className="flex justify-end gap-3">
              <ActionButton
                type="button"
                onClick={onCancel}
                variant="ghost"
                size="md"
                className="normal-case tracking-normal"
              >
                Cancel
              </ActionButton>
              <ActionButton
                type="button"
                onClick={onConfirm}
                variant={danger ? 'danger' : 'primary'}
                size="md"
                className={
                  danger ? 'bg-red-500 text-white hover:bg-red-600' : ''
                }
              >
                {confirmText}
              </ActionButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
