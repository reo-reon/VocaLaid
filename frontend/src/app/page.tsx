"use client"
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function RootRedirect() {
  const router = useRouter()

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
    if (token) {
      router.replace('/home')
    } else {
      router.replace('/login')
    }
  }, [router])

  return null
}
