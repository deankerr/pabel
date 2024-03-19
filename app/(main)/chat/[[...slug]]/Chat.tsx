'use client'

import { PermissionsCard } from '@/app/components/PermissionsCard'
import { Button } from '@/app/components/ui/Button'
import { navbarOpenAtom, sidebarOpenAtom } from '@/components/atoms'
import { InferenceParameterControls } from '@/components/threads/InferenceParameterControls'
import { MessageBubble } from '@/components/threads/MessageBubble'
import { MessageInput } from '@/components/threads/MessageInput'
import { RemoveThreadDialog } from '@/components/threads/RemoveThreadDialog'
import { RenameThreadDialog } from '@/components/threads/RenameThreadDialog'
import { useThread } from '@/components/threads/useThread'
import { UIIconButton } from '@/components/ui/UIIconButton'
import { api } from '@/convex/_generated/api'
import { cn } from '@/lib/utils'
import { Heading, ScrollArea, Tabs } from '@radix-ui/themes'
import { Preloaded } from 'convex/react'
import { useAtom } from 'jotai'
import { PanelLeftOpenIcon, SlidersHorizontalIcon, XIcon } from 'lucide-react'
import { useEffect, useRef } from 'react'

type ChatProps = {
  preload: Preloaded<typeof api.threads.threads.get>
}

export const Chat = ({ preload }: ChatProps) => {
  const { thread, messages, send, threadAtoms, updatePermissions } = useThread({ preload })

  const title = thread?.title ?? 'New Chat'

  const [navbarIsOpen, setNavbarOpen] = useAtom(navbarOpenAtom)
  const [sidebarIsOpen, setSidebarOpen] = useAtom(sidebarOpenAtom)

  const scrollRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [messages])
  /*
    useAudio()
    const [_, enqueue] = useEnqueueAudio()
    enqueue(
      messages
        .filter((m) => m.voiceover?.url)
        .map((m) => ({ messageId: m._id, url: m.voiceover?.url ?? '', played: false })),
    )

    const audioPlayer = useGlobalAudioPlayer()
  */

  return (
    <>
      <div className="h-full grow overflow-hidden">
        {/* header */}
        <div className="flex-between h-14 border-b px-3 sm:gap-2">
          {/* open navbar button */}
          {!navbarIsOpen && (
            <UIIconButton
              label="close navigation bar"
              color="gray"
              onClick={() => setNavbarOpen(!navbarIsOpen)}
            >
              <PanelLeftOpenIcon />
            </UIIconButton>
          )}
          <Heading size="3" className="flex items-center gap-1.5">
            {title}
          </Heading>

          <div className="hidden grow sm:block"></div>

          {/* parameters sidebar button */}
          <UIIconButton
            label="toggle parameters sidebar"
            onClick={() => setSidebarOpen(!sidebarIsOpen)}
          >
            {sidebarIsOpen ? <XIcon /> : <SlidersHorizontalIcon />}
          </UIIconButton>
        </div>

        {/* chat feed */}
        <ScrollArea className="h-[calc(100%-3.5rem-4rem)]">
          <div className="flex flex-col items-center gap-3 p-3 sm:p-6" ref={scrollRef}>
            {messages.map((message) => (
              <MessageBubble message={message} key={message._id} />
            ))}
          </div>
        </ScrollArea>

        {/* input */}
        <MessageInput inputAtom={threadAtoms.message} onSend={send} />

        {/* sidebar */}
        <div
          className={cn(
            'absolute right-0 top-14 h-[calc(100%-3.5rem)] w-screen translate-x-0 overflow-hidden bg-gray-1 px-2 transition-transform sm:w-80 sm:border-l',
            !sidebarIsOpen && 'absolute translate-x-full',
          )}
        >
          <Tabs.Root defaultValue="parameters">
            <Tabs.List className="shrink-0">
              <Tabs.Trigger value="parameters">Parameters</Tabs.Trigger>
              <Tabs.Trigger value="details">Details</Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="parameters" asChild>
              <ScrollArea>
                <div className="mx-auto max-w-80">
                  <InferenceParameterControls threadAtoms={threadAtoms} />
                </div>
              </ScrollArea>
            </Tabs.Content>

            <Tabs.Content value="details" asChild>
              <div className="flex grow flex-col justify-center gap-4 p-4">
                {thread && thread.owner.isViewer ? (
                  <>
                    <PermissionsCard
                      permissions={thread.permissions}
                      onPermissionsChange={(permissions) => updatePermissions(permissions)}
                    />
                    <RenameThreadDialog currentTitle={thread?.title} id={thread?._id}>
                      <Button>Rename</Button>
                    </RenameThreadDialog>
                    <RemoveThreadDialog id={thread._id} onDelete={() => {}}>
                      <Button color="red">Delete Chat</Button>
                    </RemoveThreadDialog>
                  </>
                ) : null}
              </div>
            </Tabs.Content>
          </Tabs.Root>
        </div>
      </div>
    </>
  )
}
