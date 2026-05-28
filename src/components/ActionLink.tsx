import { Link } from '@tanstack/react-router'
import { motion } from 'framer-motion'
import type { ComponentProps } from 'react'
import { cn } from '@/utils/cn'
import type { ActionVariant } from './ActionButton'

interface ActionLinkProps extends Omit<
  ComponentProps<typeof Link>,
  'children' | 'params'
> {
  variant?: ActionVariant
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'n'
  children?: React.ReactNode
  params?: Record<string, any>
}

const base =
  'inline-flex items-center justify-center gap-2 font-bold tracking-widest uppercase transition-all outline-none cursor-pointer text-center'

const variants: Record<ActionVariant, string> = {
  primary:
    'bg-[var(--color-action)] text-white hover:bg-[var(--color-action-hover)] shadow-md',
  secondary:
    'border-2 border-[var(--color-action)] text-[var(--color-action)] hover:bg-[var(--color-action)] hover:text-white',
  outline:
    'border border-[var(--color-ledger)] text-[var(--color-ink)] bg-white/50 dark:bg-black/20 hover:border-[var(--color-action)] hover:text-[var(--color-action)]',
  danger:
    'border border-red-400 text-red-600 bg-red-50/50 hover:bg-red-600 hover:text-white hover:border-red-600',
  ghost:
    'text-[var(--color-muted)] hover:text-[var(--color-action)] hover:bg-black/5 dark:hover:bg-white/5',
  link: 'text-[var(--color-action)] hover:text-[var(--color-action-hover)] underline-offset-4 hover:underline',
}

const sizeClasses = {
  n: 'p-0',
  sm: 'px-3 py-1.5 text-[10px] rounded',
  md: 'px-5 py-2.5 text-xs rounded-md',
  lg: 'px-7 py-3 text-sm rounded-md',
  xl: 'px-9 py-4 text-sm rounded-lg',
}

export function ActionLink({
  variant = 'primary',
  size = 'md',
  className,
  children,
  params,
  ...props
}: ActionLinkProps) {
  const isFullWidth = className?.includes('w-full')
  const isFlex1 = className?.includes('flex-1')

  return (
    <motion.span
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 500, damping: 20 }}
      className={cn(
        'inline-flex items-center justify-center',
        isFullWidth && 'w-full flex',
        isFlex1 && 'flex-1 flex',
      )}
    >
      <Link
        params={params as any}
        className={cn(base, variants[variant], sizeClasses[size], className)}
        {...props}
      >
        {children}
      </Link>
    </motion.span>
  )
}
