import type { ReactNode } from 'react'

interface ModalProps {
  title: string
  onClose: () => void
  children: ReactNode
  width?: number
}

export function Modal({ title, onClose, children, width = 480 }: ModalProps) {
  return (
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 p-6"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="max-h-[80vh] w-full overflow-y-auto rounded-2xl bg-white p-7 shadow-2xl"
        style={{ maxWidth: width }}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-serif text-lg font-semibold text-ink">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer border-none bg-transparent p-1 text-xl leading-none text-gray-400"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
