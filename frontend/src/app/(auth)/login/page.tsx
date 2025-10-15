"use client"
import { LoginForm, LoginFormData } from '@/feature/auth/components/LoginForm'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()

  const handleLogin = async (data: LoginFormData) => {
    // TODO: call backend auth API and handle tokens
    // For now, simulate a short delay
    await new Promise((res) => setTimeout(res, 400))
    // set a dummy token for development/testing
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', 'dummy-token-123')
      console.log('[Login] token set:', localStorage.getItem('token'))
    }

    // prefer replace to avoid back navigation to login
    try {
      router.replace('/home')
    } catch (err) {
      console.error('[Login] router.replace error', err)
      if (typeof window !== 'undefined') window.location.href = '/home'
    }

    // fallback: if still not navigated after short delay, force redirect
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        if (window.location.pathname !== '/home') {
          console.warn('[Login] fallback redirect')
          window.location.href = '/home'
        }
      }, 500)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <LoginForm onSubmit={handleLogin} />
    </div>
  )
}
