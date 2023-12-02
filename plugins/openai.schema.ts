import { messageSchema } from '@/schema/message'
import z from 'zod'

export const openaiCreateChatSchema = z.object({
  model: z.string(),
  messages: messageSchema.array(),
  stream: z.boolean().optional(),

  frequency_penalty: z.number().min(-2).max(2).step(0.01).optional(),
  max_tokens: z.number().min(1).step(1).optional(), //? max per model?
  presence_penalty: z.number().min(-2).max(2).step(0.01).optional(),
  stop: z.string().array().min(0).max(4).optional(),
  temperature: z.number().min(0).max(2).step(0.01).optional(),
  top_p: z.number().min(0).max(2).step(0.01).optional(),
})

export const openaiModerationRequestSchema = z.object({
  input: z.string().or(z.string().array()),
  model: z.optional(z.enum(['text-moderation-stable', 'text-moderation-latest'])),
})

const categoriesSchema = z.object({
  sexual: z.boolean(),
  hate: z.boolean(),
  harassment: z.boolean(),
  'self-harm': z.boolean(),
  'sexual/minors': z.boolean(),
  'hate/threatening': z.boolean(),
  'violence/graphic': z.boolean(),
  'self-harm/intent': z.boolean(),
  'self-harm/instructions': z.boolean(),
  'harassment/threatening': z.boolean(),
  violence: z.boolean(),
})

const categoryScoresSchema = z.object({
  sexual: z.number(),
  hate: z.number(),
  harassment: z.number(),
  'self-harm': z.number(),
  'sexual/minors': z.number(),
  'hate/threatening': z.number(),
  'violence/graphic': z.number(),
  'self-harm/intent': z.number(),
  'self-harm/instructions': z.number(),
  'harassment/threatening': z.number(),
  violence: z.number(),
})

const resultSchema = z.object({
  flagged: z.boolean(),
  categories: categoriesSchema,
  category_scores: categoryScoresSchema,
})

export const openaiModerationResponseSchema = z.object({
  id: z.string(),
  model: z.string(),
  results: z.array(resultSchema),
})
