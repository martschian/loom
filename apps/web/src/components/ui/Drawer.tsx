import { useEffect, type ReactNode } from 'react'

interface DrawerProps {
  title: string
  onClose: () => void
  children: ReactNode
  width?: number
}

export function Drawer({ title, onClose, children, width = 480 }: DrawerProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[1000] flex justify-end bg-black/40 transition-opacity duration-300 starting:opacity-0"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="flex h-full w-full flex-col bg-white shadow-2xl transition-transform duration-300 ease-out starting:translate-x-full"
        style={{ maxWidth: width }}
      >
        <div className="flex items-center justify-between border-b border-gray-100 px-7 py-5">
          <h2 className="font-serif text-lg font-semibold text-ink">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full border-none bg-transparent text-xl leading-none text-gray-400 transition-colors hover:bg-gray-100 hover:text-ink"
          >
            ×
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-7 py-6">{children}</div>
      </div>
    </div>
  )
}
