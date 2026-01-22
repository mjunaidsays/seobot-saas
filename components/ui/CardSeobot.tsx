import { cn } from '@/utils/cn'
import { HTMLAttributes, ReactNode } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export default function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'glass rounded-2xl p-6 transition-all duration-300',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
