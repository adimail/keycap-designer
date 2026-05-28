import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import type { HTMLMotionProps } from 'framer-motion'
import { cn } from '@/utils/cn'

export type ActionVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'danger'
  | 'ghost'
  | 'link'

interface ActionButtonProps extends Omit<
  HTMLMotionProps<'button'>,
  'children'
> {
  variant?: ActionVariant
  size?: keyof typeof sizeClasses
  children?: React.ReactNode
}

const base =
  'inline-flex items-center justify-center gap-2 font-bold tracking-widest uppercase transition-all outline-none cursor-pointer'

const variants: Record<ActionVariant, string> = {
  primary:
    'bg-[var(--color-action)] text-white hover:bg-[var(--color-action-hover)] active:translate-y-[1px] disabled:opacity-50 disabled:cursor-not-allowed border border-transparent shadow-md',
  secondary:
    'border-2 border-[var(--color-action)] text-[var(--color-action)] bg-transparent hover:bg-[var(--color-action)] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed',
  outline:
    'border border-[var(--color-ledger)] text-[var(--color-ink)] bg-white/50 dark:bg-black/20 hover:border-[var(--color-action)] hover:text-[var(--color-action)] disabled:opacity-50',
  danger:
    'border border-red-400 text-red-600 bg-red-50/50 hover:bg-red-600 hover:text-white hover:border-red-600 disabled:opacity-50',
  ghost:
    'text-[var(--color-muted)] hover:text-[var(--color-action)] hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-50',
  link: 'text-[var(--color-action)] hover:text-[var(--color-action-hover)] underline-offset-4 hover:underline disabled:opacity-50',
}

const sizeClasses = {
  n: 'p-0 text-[11px]',
  sm: 'px-3 py-1.5 text-[10px] rounded',
  md: 'px-5 py-2.5 text-xs rounded-md',
  lg: 'px-7 py-3 text-sm rounded-md',
  xl: 'px-9 py-4 text-sm rounded-lg',
}

export const ActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      children,
      whileTap,
      transition,
      ...props
    },
    ref,
  ) => {
    return (
      <motion.button
        ref={ref}
        whileTap={whileTap ?? { scale: 0.96 }}
        transition={
          transition ?? { type: 'spring', stiffness: 500, damping: 20 }
        }
        className={cn(base, variants[variant], sizeClasses[size], className)}
        {...props}
      >
        {children}
      </motion.button>
    )
  },
)
ActionButton.displayName = 'ActionButton'
