import { useCallback, useMemo, useState } from 'react'
import { useMutation } from 'convex/react'
import { useLocalStorage } from 'react-use'

import { api } from '@/convex/_generated/api'
import { useThread } from '@/lib/queries'

import type { EThread } from '@/convex/shared/types'

type UseThreadOptions = {
  slug: string
}

export const useChatInterface = ({ slug }: UseThreadOptions) => {
  const [localThread, setLocalThread] = useLocalStorage<EThread>(`e-chat-${slug}`, {
    _id: '',
    slug,
    _creationTime: 0,
    updatedAtTime: 0,
    userId: '',
  })

  const [currentId, setCurrentId] = useState(slug)
  const { data: queriedThread } = useThread(currentId)

  const thread = currentId.startsWith('_') ? localThread : queriedThread

  const createMessage = useMutation(api.db.messages.create)
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
      }
    },
    [thread, createMessage],
  )

  const updateThreadConfig = useCallback(
    async (args: Omit<Parameters<typeof updateThread>[0], 'threadId'>) => {
      if (!thread) return
      if (currentId.startsWith('_')) {
        console.log('update local thread')
        setLocalThread((prev) => (prev ? { ...prev, ...args } : undefined))
        return
      }

      console.log('update remote thread')
      await updateThread({ ...args, threadId: thread._id })
    },
    [currentId, thread, setLocalThread, updateThread],
  )

  return {
    thread: useMemo(() => thread, [thread]),
    sendMessage,
    updateThreadConfig,
  }
}
