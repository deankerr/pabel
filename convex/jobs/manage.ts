import { zid } from 'convex-helpers/server/zod'
import { ConvexError } from 'convex/values'
import { z } from 'zod'

import { internal } from '../_generated/api'
import { internalMutation, internalQuery } from '../functions'
import { insist } from '../utils'
import { jobResultSchema } from './schema'

import type { Id } from '../_generated/dataModel'
import type { MutationCtx } from '../types'
import type { JobTypes } from './schema'

export const createJob = async (
  ctx: MutationCtx,
  {
    type,
    messageId,
    threadId,
  }: { type: JobTypes; messageId: Id<'messages'>; threadId: Id<'threads'>; input?: string },
) => {
  const jobId = await ctx
    .table('jobs')
    .insert({ type, messageId, threadId, status: 'queued', results: [] })

  switch (type) {
    case 'text-to-image':
      await ctx.scheduler.runAfter(0, internal.jobs.generation.textToImage, { jobId })
      break
    case 'chat-completion':
      await ctx.scheduler.runAfter(0, internal.jobs.completion.chatCompletion, { jobId })
      break
    case 'title-completion':
      await ctx.scheduler.runAfter(0, internal.jobs.completion.titleCompletion, { jobId })
      break
    case 'create-images-from-results':
      await ctx.scheduler.runAfter(0, internal.jobs.files.createImagesFromResults, { jobId })
      break
    default:
      throw new ConvexError({ message: 'invalid job type', type })
  }

  return jobId
}

export const get = internalQuery({
  args: {
    jobId: zid('jobs'),
  },
  handler: async (ctx, { jobId }) => {
    return await ctx.table('jobs').get(jobId)
  },
})

export const acquire = internalMutation({
  args: {
    jobId: zid('jobs'),
  },
  handler: async (ctx, { jobId }) => {
    const job = await ctx.table('jobs').getX(jobId)
    insist(job.status === 'queued', 'invalid job status')

    await job.patch({ status: 'active', metrics: { startTime: Date.now() } })
    return job
  },
})

export const results = internalMutation({
  args: {
    jobId: zid('jobs'),
    status: z.enum(['complete', 'failed']),
    results: jobResultSchema.array().min(1),
  },
  handler: async (ctx, { jobId, status, results }) => {
    const job = await ctx.table('jobs').getX(jobId)
    await job.patch({ status, results, metrics: { ...job.metrics, endTime: Date.now() } })

    if (status === 'failed') return

    const thread = await ctx.table('threads').get(job.threadId)

    if (job.type === 'text-to-image') {
      await createJob(ctx, {
        type: 'create-images-from-results',
        messageId: job.messageId,
        threadId: job.threadId,
      })
    }

    if (job.type === 'title-completion') {
      const title = results.find((result) => result.type === 'message')?.value ?? '<title?>'
      await thread?.patch({ title })
    }

    if (job.type === 'chat-completion') {
      const message = results.find((result) => result.type === 'message')
      if (message) await ctx.table('messages').getX(job.messageId).patch({ content: message.value })
    }

    if (!thread?.title && job.type !== 'title-completion') {
      await createJob(ctx, {
        type: 'title-completion',
        threadId: job.threadId,
        messageId: job.messageId,
      })
    }
  },
})
