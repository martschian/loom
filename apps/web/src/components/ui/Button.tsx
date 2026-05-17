import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'danger'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
}

const variants: Record<Variant, string> = {
  primary:
    'bg-ink text-white border-none hover:bg-ink/90 disabled:opacity-50 disabled:cursor-not-allowed',
  secondary:
    'bg-transparent text-gray-600 border-[1.5px] border-gray-200 hover:border-gray-300',
  danger:
    'bg-transparent text-red-500 border-[1.5px] border-red-200 hover:border-red-300',
}

export function Button({
  variant = 'primary',
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={`cursor-pointer rounded-lg px-5 py-2.5 text-sm font-medium transition-colors ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
