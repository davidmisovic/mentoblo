import * as React from 'react'
import { clsx } from 'clsx'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'default' | 'secondary' | 'ghost'
}

export function Button({ className, variant = 'default', ...props }: ButtonProps) {
  const styles = {
    default: 'bg-black text-white hover:bg-gray-800',
    secondary: 'bg-white text-gray-900 border hover:bg-gray-50',
    ghost: 'bg-transparent text-gray-900 hover:bg-gray-100'
  }[variant]
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed border-transparent border',
        styles,
        className
      )}
      {...props}
    />
  )
}

