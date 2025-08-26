import { useState, useCallback } from 'react'

interface UseProfileDialogReturn {
  isOpen: boolean
  openDialog: () => void
  closeDialog: () => void
  toggleDialog: () => void
}

export function useProfileDialog(): UseProfileDialogReturn {
  const [isOpen, setIsOpen] = useState(false)

  const openDialog = useCallback(() => {
    setIsOpen(true)
  }, [])

  const closeDialog = useCallback(() => {
    setIsOpen(false)
  }, [])

  const toggleDialog = useCallback(() => {
    setIsOpen(prev => !prev)
  }, [])

  return {
    isOpen,
    openDialog,
    closeDialog,
    toggleDialog
  }
}
