"use client"
import React, { useState } from 'react'
import { Input } from '../../../components/ui/input'
import { Button } from '../../../components/ui/button'
import { Card } from '../../../components/ui/card'

export type LoginFormData = {
  email: string
  password: string
}

export type LoginFormProps = {
  onSubmit: (data: LoginFormData) => Promise<void> | void
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await Promise.resolve(onSubmit({ email, password }))
    } catch (err) {
      setError('Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Sign in</h2>
        {error && <div className="text-red-600">{error}</div>}
        <label className="flex flex-col text-sm">
          <span className="mb-1">Email</span>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        </label>
        <label className="flex flex-col text-sm">
          <span className="mb-1">Password</span>
          <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••" />
        </label>
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" /> <span>Remember me</span>
          </label>
          <a className="text-sm text-blue-600 hover:underline" href="#">Forgot?</a>
        </div>
        <Button type="submit" disabled={loading}>{loading ? 'Signing in...' : 'Sign in'}</Button>
      </form>
    </Card>
  )
}

export default LoginForm
