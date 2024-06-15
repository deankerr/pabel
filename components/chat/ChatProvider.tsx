import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { useMutation } from 'convex/react'
import { useLocalStorage } from 'react-use'

import { api } from '@/convex/_generated/api'
import { defaultChatInferenceConfig } from '@/convex/shared/defaults'
import { useThread } from '@/lib/queries'

import type { EThread } from '@/convex/shared/types'

const useChatContextApi = ({
  slug,
  onClose,
}: {
  slug: string
  onClose?: (slug: string) => void
}) => {
  const [localThread, setLocalThread, removeLocalThread] = useLocalStorage<EThread>(
    `chat-${slug}`,
    {
      _id: '',
      slug,
      _creationTime: 0,
      updatedAtTime: 0,
      userId: '',
      config: {
        ui: defaultChatInferenceConfig,
        saved: [],
      },
    },
  )

  const [currentId, setCurrentId] = useState(slug)
  const { data: queriedThread } = useThread(currentId)

  const thread = currentId.startsWith('_') ? localThread : queriedThread

  const createMessage = useMutation(api.db.messages.create)
  const apiRemoveMessage = useMutation(api.db.messages.remove)
  const run = useMutation(api.db.messages.run)
  const updateThread = useMutation(api.db.threads.update)

  const sendMessage = useCallback(
    async (args: Omit<Parameters<typeof createMessage>[0], 'threadId'>) => {
      if (!thread) return
      const { threadId: newThreadId } = await createMessage({
        ...args,
        threadId: thread._id,
      })

      if (newThreadId !== thread._id) {
        console.log('change thread id')
        setCurrentId(newThreadId)
        removeLocalThread()
      }
    },
    [thread, createMessage, removeLocalThread],
  )

  const removeMessage = useCallback(
    async (messageId: string) => {
      await apiRemoveMessage({ messageId })
    },
    [apiRemoveMessage],
  )

  const runInference = useCallback(
    async (args: Omit<Parameters<typeof run>[0], 'threadId'>) => {
      if (!thread) return
      const { threadId: newThreadId } = await run({
        ...args,
        threadId: thread._id,
      })

      if (newThreadId !== thread._id) {
        console.log('change thread id')
        setCurrentId(newThreadId)
        removeLocalThread()
      }
    },
    [thread, run, removeLocalThread],
  )

  const updateThreadConfig = useCallback(
    async (args: Omit<Parameters<typeof updateThread>[0], 'threadId'>['fields']) => {
      if (!thread) return
      if (currentId.startsWith('_')) {
        setLocalThread((prev) => (prev ? { ...prev, ...args } : undefined))
        return
      }

      await updateThread({ threadId: thread._id, fields: args })
    },
    [currentId, thread, setLocalThread, updateThread],
  )

  const closeChat = useCallback(() => {
    if (onClose) onClose(slug)
  }, [onClose, slug])

  return {
    thread: useMemo(() => thread, [thread]),
    sendMessage,
    removeMessage,
    runInference,
    updateThreadConfig,
    closeChat: onClose ? closeChat : undefined,
  }
}

type ChatContext = ReturnType<typeof useChatContextApi>
const ChatContext = createContext<ChatContext | undefined>(undefined)

export const ChatProvider = ({
  children,
  ...props
}: {
  slug: string
  onClose?: (slug: string) => void
  children: React.ReactNode
}) => {
  const api = useChatContextApi(props)

  return <ChatContext.Provider value={api}>{children}</ChatContext.Provider>
}

export const useChat = (): ChatContext => {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
}
