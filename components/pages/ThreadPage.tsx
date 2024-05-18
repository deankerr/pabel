'use client'

import { MessageCard, MessageCardSkeleton } from '@/components/cards/MessageCard'
import { ThreadContainer } from '@/components/thread/ThreadContainer'
import { useThreadIndex } from '@/lib/api'

import type { ThreadIndex } from '@/lib/types'

export const ThreadPage = ({ index }: { index?: ThreadIndex }) => {
  const { thread, messages, series, file } = useThreadIndex(index)

  const shouldShowFile = series?.length && file

  if (!thread) return null

  return (
    <>
      <div className="absolute box-border h-[calc(100vh-3rem-2px)] w-full p-2">
        {shouldShowFile && (
          <MessageCard
            className="mx-auto w-full max-w-4xl"
            slug={thread.slug}
            message={series[0]!}
            file={file}
          />
        )}

        {!shouldShowFile && <ThreadContainer thread={thread} page={messages} series={series} />}
      </div>
    </>
  )
}

export const ThreadPageSkeleton = () => {
  return (
    <>
      <div className="absolute inset-0 grid w-full animate-pulse grid-rows-4 gap-4 p-1 md:p-4">
        <MessageCardSkeleton />
        <MessageCardSkeleton />
        <MessageCardSkeleton />
        <MessageCardSkeleton />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-1"></div>
    </>
  )
}

/*
      {file ? (
        <div className="grid h-full place-content-center px-1 py-4 md:px-4">
          <ImageCard image={file} />
        </div>
      ) : message ? (
        <div className="mx-auto w-full max-w-4xl px-1 py-2 md:px-4">
          <MessageCard className="mx-auto" message={message} />
        </div>
      ) : (
        <div className="mx-auto w-full max-w-4xl px-1 pb-40 pt-2 md:px-4">
          <div className="py-1 flex-center">
            <Button variant="surface" disabled={page.isLoading} onClick={() => page.loadMore(3)}>
              {page.status}
            </Button>
          </div>
          <MessagesContainer messages={messages} style={{ height: '70vh' }} />
        </div>
      )}

      /* <div className="absolute left-0 top-0 bg-overlay font-mono text-xs text-gray-11">
        keys:{JSON.stringify(keys)} t:{thread?.messages?.length} m:{messages?.length}
      </div>
*/