import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { Input, Label } from '@/components/ui/FormField'
import { useAuth } from '@/hooks/useAuth'

export function SignupPage() {
  const { signUp, session, loading } = useAuth()
  const navigate = useNavigate()
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [checkEmail, setCheckEmail] = useState(false)

  if (loading) return null
  if (session) return <Navigate to="/" replace />

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const { error: err, needsEmailConfirmation } = await signUp(
      email,
      password,
      displayName,
    )
    setSubmitting(false)
    if (err) {
      setError(err)
    } else if (needsEmailConfirmation) {
      setCheckEmail(true)
    } else {
      navigate('/')
    }
  }

  if (checkEmail) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-6">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm text-center">
          <h1 className="mb-2 font-serif text-2xl font-bold text-ink">Check your email</h1>
          <p className="mb-6 text-sm text-gray-500">
            We sent a confirmation link to <span className="font-medium text-ink">{email}</span>.
            Click the link to activate your account.
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
        <p className="mb-6 text-sm text-gray-500">Create your account</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <Label>DISPLAY NAME</Label>
            <Input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              placeholder="Your pen name"
            />
          </div>
          <div>
            <Label>EMAIL</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div>
            <Label>PASSWORD</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? 'Creating account...' : 'Sign up'}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="text-ink underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
