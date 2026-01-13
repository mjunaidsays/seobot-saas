import { cn } from '@/utils/cn'
import { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export default function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-gray-900 border border-gray-800 rounded-lg p-6 transition-all duration-300',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
