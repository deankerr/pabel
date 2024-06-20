import { IconButton } from '@radix-ui/themes'
import { useSetAtom } from 'jotai'
import { ImagesIcon, LinkIcon, MessagesSquareIcon, SidebarIcon, XIcon } from 'lucide-react'
import Link from 'next/link'

import { ChatMenu } from '@/components/chat/ChatMenu'
import { useChat } from '@/components/chat/ChatProvider'
import { VoiceoverAutoplayButton } from '@/components/chat/VoiceoverAutoplayButton'
import { showSidebarAtom } from '@/lib/atoms'

export const ChatHeader = () => {
  const { thread, closeChat } = useChat()

  const toggleSidebar = useSetAtom(showSidebarAtom)

  const Icon = thread?.config.ui.type === 'text-to-image' ? ImagesIcon : MessagesSquareIcon
  return (
    <div className="h-10 shrink-0 border-b border-grayA-3 flex-between">
      <div className="shrink-0 gap-2 pl-3 flex-start">
        {thread && (
          <>
            <ChatMenu thread={thread}>
              <IconButton variant="ghost">
                <Icon className="size-5" />
              </IconButton>
            </ChatMenu>
            <div className="text-sm font-semibold">{thread?.title ?? 'Untitled'}</div>
          </>
        )}
      </div>

      <div className="shrink-0 gap-2 pl-3 pr-3 flex-end">
        {thread && (
          <>
            <VoiceoverAutoplayButton threadId={thread._id} />
            <IconButton variant="ghost" color="gray" onClick={() => toggleSidebar()}>
              <SidebarIcon className="size-5" />
            </IconButton>
            <Link href={`/c/${thread?.slug}`}>
              <LinkIcon className="size-5 text-gray-11" />
            </Link>
          </>
        )}

        {closeChat && (
          <IconButton variant="ghost" color="gray" onClick={closeChat}>
            <XIcon className="size-5" />
          </IconButton>
        )}
      </div>
    </div>
  )
}
