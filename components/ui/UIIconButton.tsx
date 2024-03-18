import { cn } from '@/lib/utils'
import { IconButton as RxIconButton } from '@radix-ui/themes'
import { LucideIcon } from 'lucide-react'
import { forwardRef } from 'react'
import { AccessibleIcon } from './AccessibleIcon'

type Props = {
  icon?: LucideIcon
  label: string
}

export const UIIconButton = forwardRef<
  HTMLButtonElement,
  Props & React.ComponentProps<typeof RxIconButton>
>(function UIIconButton({ icon, label, children, className, ...props }, forwardedRef) {
  const LuIcon = icon

  return (
    <RxIconButton
      variant="ghost"
      {...props}
      className={cn('m-0 cursor-pointer disabled:cursor-not-allowed', className)}
      ref={forwardedRef}
    >
      <AccessibleIcon label={label}>{LuIcon ? <LuIcon className="" /> : children}</AccessibleIcon>
    </RxIconButton>
  )
})