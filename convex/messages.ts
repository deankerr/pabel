import { zid } from 'convex-helpers/server/zod'
import { z } from 'zod'

import { external } from './external'
import { mutation, query } from './functions'
import { getGenerationXL, runGenerationInference } from './generation'
import { messageFields, ridField } from './schema'
import { generateRid } from './utils'

import type { Ent, QueryCtx } from './types'

// *** public queries ***
export const getMessageEntXL = async (ctx: QueryCtx, message: Ent<'messages'>) => {
  const generations = await message
    .edge('generations')
    .filter((q) => q.eq(q.field('deletionTime'), undefined))
    .map(async (generation) => await getGenerationXL(ctx, generation))

  const xl = {
    message,
    generations: generations.length ? generations : null,
  }

  return external.xl.message.parse(xl)
}

export const get = query({
  args: {
    rid: ridField,
  },
  handler: async (ctx, { rid }) => {
    const message = await ctx.table('messages', 'rid', (q) => q.eq('rid', rid)).unique()
    if (!message || message.deletionTime) return null

    return await getMessageEntXL(ctx, message)
  },
})

export const getPageMetadata = query({
  args: {
    rid: ridField,
  },
  handler: async (ctx, { rid }) => {
    const message = await ctx.table('messages', 'rid', (q) => q.eq('rid', rid)).unique()
    if (!message || message.deletionTime) return null

    const generations = await message.edge('generations')
    const title = generations?.[0]?.prompt ?? `Message from ${message.name ?? message.role}`
    // const icon = generations.length ? ' ✴️' : ''
    const description = `it's the e/suite - ${title}`

    return {
      title,
      description,
    }
  },
})
// *** end public queries ****

export const create = mutation({
  args: {
    threadId: zid('threads'),
    message: z.object(messageFields),
    private: z.boolean().default(true),
  },
  handler: async (ctx, { threadId, message: messageFields, ...args }) => {
    const rid = await generateRid(ctx, 'messages')
    const user = await ctx.viewerX()

    const message = await ctx
      .table('messages')
      .insert({ threadId, ...messageFields, rid, userId: user._id, private: args.private })
      .get()

    if (message.inference?.generation) await runGenerationInference(ctx, message)

    return message._id
  },
})

export const remove = mutation({
  args: {
    messageId: zid('messages'),
  },
  handler: async (ctx, { messageId }) => {
    await ctx.table('messages').getX(messageId).delete()
  },
})
