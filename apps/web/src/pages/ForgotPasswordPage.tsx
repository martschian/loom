import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Input, Label } from '@/components/ui/FormField'
import { useAuth } from '@/hooks/useAuth'

export function ForgotPasswordPage() {
  const { sendPasswordReset, session, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [sent, setSent] = useState(false)

  if (loading) return null
  if (session) return <Navigate to="/" replace />

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const { error: err } = await sendPasswordReset(email)
    setSubmitting(false)
    // Always show the confirmation state on success, even if no account
    // exists for this email — avoids leaking which emails are registered.
    if (err) {
      setError(err)
    } else {
      setSent(true)
    }
  }

  if (sent) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm text-center">
          <h1 className="mb-2 font-serif text-2xl font-bold text-ink">Check your email</h1>
          <p className="mb-6 text-sm text-gray-500">
            If an account exists for <span className="font-medium text-ink">{email}</span>,
            we sent a link to reset your password.
          </p>
          <Link to="/login" className="text-sm text-ink underline">
            Back to sign in
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="mb-1 font-serif text-2xl font-bold text-ink">Loom</h1>
        <p className="mb-6 text-sm text-gray-500">
          Enter your email and we&apos;ll send you a link to reset your password.
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <Label>EMAIL</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              autoFocus
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? 'Sending...' : 'Send reset link'}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-500">
          <Link to="/login" className="text-ink underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
