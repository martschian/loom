import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Avatar } from '@/components/ui/Avatar'
import { useAuth } from '@/hooks/useAuth'

export function AppHeader() {
  const { profile, signOut } = useAuth()
  const [open, setOpen] = useState(false)
  const displayName = profile?.display_name || 'Writer'

  return (
    <div className="bg-ink">
      <div className="mx-auto flex max-w-[900px] items-center justify-between px-8 py-5">
        <div className="flex items-baseline gap-2.5">
          <Link to="/" className="font-serif text-2xl font-bold tracking-tight text-white no-underline">
            Inkwell
          </Link>
          <span className="text-xs text-gray-500">creative writing</span>
        </div>
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="flex cursor-pointer items-center gap-2 rounded-lg border border-white/20 bg-white/10 py-1.5 pl-1.5 pr-3 text-white"
          >
            <Avatar name={displayName} size={28} />
            <span className="text-[13px] font-medium">{displayName}</span>
            <span className="text-[10px] opacity-60">▾</span>
          </button>
          {open && (
            <div className="absolute right-0 top-[calc(100%+8px)] z-[100] min-w-[180px] rounded-[10px] border-[1.5px] border-gray-200 bg-white p-2 shadow-xl">
              <button
                type="button"
                onClick={() => {
                  signOut()
                  setOpen(false)
                }}
                className="w-full cursor-pointer rounded-md border-none bg-transparent px-2.5 py-2 text-left text-[13px] text-gray-600 hover:bg-gray-50"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
