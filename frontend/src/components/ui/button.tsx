"use client"
import React from 'react'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost'
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', className = '', children, ...rest }) => {
  const base = 'rounded px-4 py-2 font-medium transition '
  const variants: Record<string, string> = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    ghost: 'bg-transparent border border-gray-200 hover:bg-gray-100'
  }

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </button>
  )
}

export default Button
