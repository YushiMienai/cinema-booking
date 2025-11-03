import {create} from 'zustand'

type ToastType = 'success' | 'error' | 'warning'

interface ToastStore {
  toast: {message: string; type: ToastType} | null
  showToast: (message: string, type?: ToastType) => void
  hideToast: () => void
}

export const useToastStore = create<ToastStore>((set) => ({
  toast: null,
  showToast: (message: string, type: ToastType = 'success') => {
    set({toast: {message, type}})

    setTimeout(() => {
      set({toast: null})
    }, 4000)
  },
  hideToast: () => set({toast: null})
}))
