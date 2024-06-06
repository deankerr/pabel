import { pick } from 'convex-helpers'
import { z } from 'zod'

import { query } from '../functions'

import type { E_Thread } from '../shared/types'
import type { Ent, QueryCtx } from '../types'

const threadShape = (thread: Ent<'threads'>): E_Thread =>
  pick(thread, [
    '_id',
    '_creationTime',
    'title',
    'slug',
    'instructions',
    'latestActivityTime',
    'userId',
  ])

const getThreadBySlugOrId = async (ctx: QueryCtx, slugOrId: string) => {
  const id = ctx.unsafeDb.normalizeId('threads', slugOrId)
  const thread = id
    ? await ctx.table('threads').get(id)
    : await ctx.table('threads', 'slug', (q) => q.eq('slug', slugOrId)).unique()
  return thread && !thread.deletionTime ? thread : null
}

export const get = query({
  args: {
    slugOrId: z.string(),
  },
  handler: async (ctx, args): Promise<E_Thread | null> => {
    const thread = await getThreadBySlugOrId(ctx, args.slugOrId)
    return thread ? threadShape(thread) : null
  },
})

export const list = query({
  args: {},
  handler: async (ctx): Promise<E_Thread[]> => {
    const userId = ctx.viewerId
    if (!userId) return []

    const threads = await ctx
      .table('threads', 'userId', (q) => q.eq('userId', userId))
      .filter((q) => q.eq(q.field('deletionTime'), undefined))
      .map(threadShape)

    return threads
  },
})
