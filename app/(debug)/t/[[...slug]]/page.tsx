'use client'

import { useQuery } from 'convex/react'
import NextLink from 'next/link'

import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'

export default function TPage({ params }: { params: { slug?: [Id<'threads'>] } }) {
  const threadId = params.slug ? params.slug[0] : undefined
  const queryKey = threadId ? { threadId, limit: 100 } : 'skip'
  const messages = useQuery(api.messages.list, queryKey)

  const gens = messages?.filter((m) => m.inference?.type === 'textToImage')

  return (
    <div className="flex flex-col">
      {gens?.map((m) => (
        <NextLink key={m._id} href={`/m/${m._id}`}>
          {(m.inference as any)?.title ?? 'untitled'}
        </NextLink>
      ))}
    </div>
  )
}