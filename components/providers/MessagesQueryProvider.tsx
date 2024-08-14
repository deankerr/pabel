'use client'

import { createContext, useCallback, useContext } from 'react'
import { usePaginatedQuery } from 'convex/react'
import { useQueryState } from 'nuqs'

import { appConfig } from '@/config/config'
import { api } from '@/convex/_generated/api'
import { useSuitePath } from '@/lib/helpers'

import type { EMessage } from '@/convex/types'
import type { UsePaginatedQueryReturnType } from 'convex/react'

export const MessagesQueryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { slug } = useSuitePath()
  const [viewFilter] = useQueryState('view')
  const [roleFilter] = useQueryState('role')

  const queryKey = slug
    ? {
        slugOrId: slug,
        byMediaType: viewFilter === 'images' ? ('images' as const) : undefined,
        role: ['user', 'assistant'].includes(roleFilter || '')
          ? (roleFilter as 'user' | 'assistant')
          : undefined,
      }
    : 'skip'

  const { results, loadMore, status } = usePaginatedQuery(api.db.threads.listMessages, queryKey, {
    initialNumItems: appConfig.nInitialMessages,
  })

  const messages = [...results].reverse()

  const value = {
    messages,
    loadMore: useCallback(() => loadMore(appConfig.nInitialMessages * 2), [loadMore]),
    status,
  }

  return <MessagesQueryContext.Provider value={value}>{children}</MessagesQueryContext.Provider>
}

type MessagesQueryContextType = {
  messages: EMessage[]
  loadMore: () => void
  status: UsePaginatedQueryReturnType<typeof api.db.threads.listMessages>['status']
}

const MessagesQueryContext = createContext<MessagesQueryContextType | undefined>(undefined)

export const useMessagesQuery = (): MessagesQueryContextType => {
  const context = useContext(MessagesQueryContext)
  if (!context) {
    throw new Error('useMessagesQuery must be used within a MessagesQueryProvider')
  }
  return context
}
