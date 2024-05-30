import { IconButton } from '@radix-ui/themes'
import { DotIcon, ImageIcon, MessagesSquareIcon, XIcon } from 'lucide-react'

import { NonSecureAdminRoleOnly } from '@/components/util/NonSecureAdminRoleOnly'
import { cn } from '@/lib/utils'

import type { EThreadWithContent } from '@/convex/shared/structures'

type HeaderBarProps = {
  thread: EThreadWithContent
  handleCloseThread: () => void
} & React.ComponentProps<'div'>

export const HeaderBar = ({
  handleCloseThread,
  thread,
  className,
  children,
  ...props
}: HeaderBarProps) => {
  return (
    <div {...props} className={cn('h-full px-2 text-sm flex-between', className)}>
      <div className="gap-1 flex-center">
        <DotIcon />
        {thread.active.type.includes('image') ? (
          <ImageIcon className="size-5" />
        ) : (
          <MessagesSquareIcon className="size-5" />
        )}
      </div>

      <div>{children}</div>

      <IconButton variant="ghost" color="gray" className="shrink-0" onClick={handleCloseThread}>
        <XIcon />
      </IconButton>

      <NonSecureAdminRoleOnly>
        <div className="absolute left-0 top-0 font-mono text-xs text-gold-4">{thread.slug}</div>
      </NonSecureAdminRoleOnly>
    </div>
  )
}