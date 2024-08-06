import * as Icons from '@phosphor-icons/react/dist/ssr'
import { Button as RadixButton, IconButton as RadixIconButton } from '@radix-ui/themes'

import { cn } from '@/lib/utils'

import type { SetRequired } from 'type-fest'

export const IconButton = ({
  className,
  children,
  ...props
}: SetRequired<React.ComponentProps<typeof RadixIconButton>, 'aria-label'>) => {
  return (
    <RadixIconButton
      {...props}
      className={cn('shrink-0', props.variant === 'ghost' && 'm-0', className)}
    >
      {children}
    </RadixIconButton>
  )
}

export const Button = ({
  children,
  className,
  ...props
}: React.ComponentProps<typeof RadixButton>) => {
  return (
    <RadixButton
      {...props}
      className={cn('shrink-0', props.variant === 'ghost' && 'm-0', className)}
    >
      {children}
    </RadixButton>
  )
}
