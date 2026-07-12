import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Input, Label } from '@/components/ui/FormField'
import { useAuth } from '@/hooks/useAuth'

export function ResetPasswordPage() {
  const { session, loading, updatePassword } = useAuth()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (loading) return null

  // The reset-password link signs the user into a temporary "recovery"
  // session automatically (Supabase JS detects the token in the URL). No
  // session here means the link is missing, already used, or expired.
  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm text-center">
          <h1 className="mb-2 font-serif text-2xl font-bold text-ink">Link expired</h1>
          <p className="mb-6 text-sm text-gray-500">
            This password reset link is invalid or has expired. Request a new one to continue.
          </p>
          <Link to="/forgot-password" className="text-sm text-ink underline">
            Request a new link
          </Link>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    setSubmitting(true)
    const { error: err } = await updatePassword(password)
    setSubmitting(false)
    if (err) {
      setError(err)
    } else {
      navigate('/')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="mb-1 font-serif text-2xl font-bold text-ink">Loom</h1>
        <p className="mb-6 text-sm text-gray-500">Choose a new password</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <Label>NEW PASSWORD</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
              autoFocus
            />
          </div>
          <div>
            <Label>CONFIRM PASSWORD</Label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? 'Updating...' : 'Update password'}
          </Button>
        </form>
      </div>
    </div>
  )
}
