import { cn } from '@/utils/cn'
import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'font-medium rounded-lg transition-all duration-200 inline-flex items-center justify-center',
        {
          'bg-primary-green text-black hover:bg-primary-lime hover:scale-105': variant === 'primary',
          'bg-transparent border-2 border-primary-green text-primary-green hover:bg-primary-green hover:text-black': variant === 'outline',
          'bg-gray-800 text-white hover:bg-gray-700': variant === 'secondary',
          'px-4 py-2 text-sm': size === 'sm',
          'px-6 py-3 text-base': size === 'md',
          'px-8 py-4 text-lg': size === 'lg',
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
