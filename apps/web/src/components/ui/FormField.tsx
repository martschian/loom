import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react'

export function Label({ children }: { children: ReactNode }) {
  return (
    <label className="mb-1.5 block text-xs font-medium tracking-wide text-gray-500">
      {children}
    </label>
  )
}

const inputClass =
  'w-full rounded-lg border-[1.5px] border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-gray-400 box-border'

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={inputClass} {...props} />
}

export function Textarea(
  props: TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  return <textarea className={`${inputClass} min-h-20 resize-y`} {...props} />
}

export function Select(props: InputHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={`${inputClass} cursor-pointer`} {...props} />
  )
}
