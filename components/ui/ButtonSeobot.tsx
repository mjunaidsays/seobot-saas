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
        'font-semibold rounded-xl transition-all duration-300 inline-flex items-center justify-center',
        'ease-out transform',
        {
          'bg-emerald-500 text-white hover:bg-emerald-400 hover:scale-105 glow-emerald-hover': variant === 'primary',
          'bg-transparent border-2 border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-400 hover:text-emerald-300': variant === 'outline',
          'glass text-white hover:bg-white/10': variant === 'secondary',
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
