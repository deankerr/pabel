import { filter } from 'convex-helpers/server/filter'
import { v } from 'convex/values'
import { z } from 'zod'

import { internal } from '../_generated/api'
import { internalAction, internalMutation } from '../functions'
import { claimJob, completeJob, createJob as createJobNext, handleJobError } from '../jobs'
import { createOpenAiClient } from '../lib/openai'
import { getChatConfig, hasDelimiter, insist } from '../shared/utils'

const defaultMaxHistoryMessages = 20

const msgSchema = z
  .object({
    role: z.enum(['system', 'assistant', 'user']),
    name: z.string().optional(),
    text: z.string(),
  })
  .transform((m) => ({
    role: m.role,
    name: m.name,
    content: m.text,
  }))

export const start = internalMutation({
  args: {
    jobId: v.id('jobs'),
  },
  handler: async (ctx, args) => {
    const job = await claimJob(ctx, args)
    const messageId = job.messageId
    insist(messageId, 'required: messageId', { code: 'invalid_job' })

    const message = await ctx.table('messages').getX(messageId)
    const chatConfig = getChatConfig(message.inference)
    insist(chatConfig, 'required: chatConfig', { code: 'invalid_job' })

    const rawMessages = await filter(
      ctx.unsafeDb
        .query('messages')
        .withIndex('threadId', (q) => q.eq('threadId', message.threadId)),
      async (m) => {
        if (m.deletionTime !== undefined) return false
        if (m._creationTime > message._creationTime) return false
        if (!m.text) return false
        if (m.name && chatConfig.excludeHistoryMessagesByName?.includes(m.name)) return false
        return true
      },
    )
      .order('desc')
      .take(chatConfig.maxHistoryMessages ?? defaultMaxHistoryMessages)

    const messages = rawMessages.map((m) => msgSchema.parse(m))

    const thread = await ctx.table('threads').getX(message.threadId)
    if (thread.instructions) {
      messages.push({ role: 'system', name: undefined, content: thread.instructions })
    }

    return { message, messages: messages.toReversed(), chatConfig }
  },
})

export const run = internalAction({
  args: {
    jobId: v.id('jobs'),
  },
  handler: async (ctx, args) => {
    try {
      const { message, messages, chatConfig } = await ctx.runMutation(
        internal.inference.chat.start,
        args,
      )

      const { type, endpoint, endpointModelId, resourceKey, ...parameters } = chatConfig
      parameters.excludeHistoryMessagesByName = undefined
      parameters.maxHistoryMessages = undefined

      const api = createOpenAiClient(endpoint)

      console.log(`[${type}]`, `[${endpoint}]`, parameters, messages)

      const nonStreaming = async () => {
        const chatCompletion = await api.chat.completions.create({
          ...parameters,
          model: endpointModelId,
          messages,
          stream: false,
        })

        console.log(chatCompletion)

        const content = chatCompletion.choices[0]?.message.content ?? '' //TODO check
        return content
      }

      const streaming = async () => {
        const stream = await api.chat.completions.create({
          ...parameters,
          model: endpointModelId,
          messages,
          stream: true,
        })

        let body = ''
        for await (const part of stream) {
          const text = part.choices[0]?.delta?.content
          if (text) {
            body += text
            if (hasDelimiter(text)) {
              await ctx.runMutation(internal.db.messages.streamText, {
                messageId: message._id,
                text: body,
              })
            }
          }
        }

        return body
      }

      const isStreamingRequest = chatConfig.stream ?? true
      const content = isStreamingRequest ? await streaming() : await nonStreaming()
      console.log(content)

      await ctx.runMutation(internal.inference.chat.complete, {
        jobId: args.jobId,
        messageId: message._id,
        text: content,
      })
    } catch (error) {
      await handleJobError(ctx, { error, jobId: args.jobId })
    }
  },
})

export const complete = internalMutation({
  args: {
    jobId: v.id('jobs'),
    messageId: v.id('messages'),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    const message = await ctx.skipRules.table('messages').getX(args.messageId)
    await message.patch({ text: args.text })

    // * title generation
    const thread = await ctx.skipRules.table('threads').getX(message.threadId)
    if (!thread.title) {
      await createJobNext(ctx, {
        name: 'inference/threadTitleCompletion',
        fields: {
          threadId: message.threadId,
        },
      })
    }
    await completeJob(ctx, { jobId: args.jobId })
  },
})
