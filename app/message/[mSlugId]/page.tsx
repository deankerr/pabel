'use client'

import { useQuery } from 'convex/react'

import { MessagePageView } from '@/components/pages/MessagePageView'
import { api } from '@/convex/_generated/api'

export default function MessagePage({
  params: { mSlugId: slugId },
}: {
  params: { mSlugId: string }
}) {
  const m = useQuery(api.messages.getBySlugIdBeta, { slugId })
  if (!m) return null
  return <MessagePageView {...m} />
}