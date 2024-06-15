import { Fragment } from 'react'
import { IconButton } from '@radix-ui/themes'
import { formatDistanceToNow } from 'date-fns'
import { ImageIcon, MessageSquareIcon, Trash2Icon } from 'lucide-react'
import Markdown from 'markdown-to-jsx'

import { useChat } from '@/components/chat/ChatProvider'
import { ImageCard } from '@/components/images/ImageCard'
import { SyntaxHighlightedCode } from '@/components/util/SyntaxHighlightedCode'
import { cn } from '@/lib/utils'

import type { EMessage } from '@/convex/shared/types'

export const Message = ({
  message,
  className,
  ...props
}: { message: EMessage } & React.ComponentProps<'div'>) => {
  const { removeMessage } = useChat()

  const textToImage = message.inference?.type === 'text-to-image' ? message.inference : null
  const title = textToImage ? textToImage.prompt : message?.name || message.role
  const Icon = textToImage ? ImageIcon : MessageSquareIcon
  return (
    <div {...props} className={cn('shrink-0 space-y-1 py-2 text-sm', className)}>
      <div className="gap-2 border-b px-1 font-medium flex-between">
        <div className="gap-2 flex-start">
          <Icon className="-mr-0.5 size-4 flex-none text-accent-11" />
          <div className="truncate capitalize">{title}</div>

          <div className="text-xs text-gray-11">
            {formatDistanceToNow(new Date(message._creationTime), { addSuffix: true })}
          </div>
        </div>

        <div className="gap-2 flex-end">
          <IconButton
            variant="ghost"
            color="red"
            size="1"
            onClick={() => removeMessage(message._id)}
          >
            <Trash2Icon className="size-4" />
          </IconButton>
        </div>
      </div>

      {message.files && message.files.length > 0 && (
        <div
          className={cn(
            'mx-auto grid w-full justify-items-center gap-2 overflow-hidden py-1',
            message.files.length > 1 ? 'grid-cols-2' : '',
          )}
        >
          {message.files.map((file) => {
            if (file.type !== 'image') return null
            return (
              <ImageCard key={file.id} image={file.image} sizes="(max-width: 56rem) 50vw, 28rem" />
            )
          })}
        </div>
      )}

      {message.content && (
        <div className="prose prose-sm prose-stone prose-invert mx-auto max-w-none px-1 prose-pre:p-0">
          <Markdown
            options={{
              wrapper: Fragment,
              disableParsingRawHTML: true,
              overrides: {
                code: SyntaxHighlightedCode,
              },
            }}
          >
            {message.content}
          </Markdown>
        </div>
      )}
    </div>
  )
}
