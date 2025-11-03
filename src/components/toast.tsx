// components/Toast.tsx
import {useToastStore} from '@stores'
import './Toast.css'

export const Toast = () => {
  const { toast, hideToast } = useToastStore()

  if (!toast) return null

  return (
    <div
      className={`toast toast-${toast.type}`}
      onClick={hideToast}
    >
      <div className="toast-content">
        {toast.type === 'success' && '✅ '}
        {toast.type === 'error' && '❌ '}
        {toast.type === 'warning' && '⚠️ '}
        {toast.message}
      </div>
    </div>
  )
}
