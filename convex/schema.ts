import { defineEnt, defineEntSchema, getEntDefinitions } from 'convex-ents'
import { zid, zodToConvex, zodToConvexFields } from 'convex-helpers/server/zod'
import { z } from 'zod'

import {
  completionProviders,
  generationProviders,
  maxMessageContentStringLength,
  maxMessageNameStringLength,
  maxTitleStringLength,
  messageRoles,
} from './constants'

//* Permissions
const permissionsSchema = z.object({
  public: z.boolean(),
})

//* Chat/Completion
export const completionParametersSchema = z.object({
  model: z.string(),
  max_tokens: z.number().optional(),
  stop: z.string().array().optional(),
  temperature: z.number().optional(),
  top_p: z.number().optional(),
  top_k: z.number().optional(),
  repetition_penalty: z.number().optional(),
  stream: z.boolean().optional(),
})

export const chatInference = z.object({
  jobId: zid('_scheduled_functions').optional(),
  type: z.literal('chat'),
  provider: z.enum(completionProviders),
  parameters: completionParametersSchema,

  recentMessagesLimit: z.number().optional(),
})

//* Images
export const imagesFields = {
  jobId: zid('_scheduled_functions').optional(),
  sourceUrl: z.string(),
  width: z.number(),
  height: z.number(),

  storageId: zid('_storage').optional(),
  storageUrl: z.string().optional(),

  blurDataURL: z.string().optional(),
  color: z.string().optional(),
}
const images = defineEnt(zodToConvexFields(imagesFields))
  .deletion('soft')
  .index('sourceUrl', ['sourceUrl'])

//* Generation
export const generationParametersSchema = z.object({
  model: z.string(),
  prompt: z.string(),
  negativePrompt: z.string().optional(),
  width: z.number(),
  height: z.number(),
  seed: z.number().optional(),
  steps: z.string().optional(),
  guidance: z.number().optional(),
  lcm: z.boolean().optional(),
  n: z.number().optional(),
})

export const generationInference = z.object({
  jobId: zid('_scheduled_functions').optional(),
  type: z.literal('textToImage'),
  provider: z.enum(generationProviders),
  parameters: generationParametersSchema,

  title: z
    .string()
    .transform((value) => value.slice(0, maxTitleStringLength))
    .optional(),
})

//* Messages
export const messageContentSchema = z.union([
  z.string().transform((value) => value.slice(0, maxMessageContentStringLength)),
  z
    .object({
      type: z.literal('image'),
      imageId: zid('images'),
    })
    .array(),
])

export const messagesFields = {
  role: z.enum(messageRoles),
  name: z
    .string()
    .transform((value) => value.slice(0, maxMessageNameStringLength))
    .optional(),
  content: messageContentSchema.optional(),

  inference: z.discriminatedUnion('type', [chatInference, generationInference]).optional(),

  persistant: z.boolean().optional(),

  permissions: permissionsSchema.optional(),
}
const messages = defineEnt(zodToConvexFields(messagesFields))
  .deletion('soft')
  .edge('thread')
  .index('persistant', ['persistant'])

//* Threads
export const threadsFields = {
  title: z
    .string()
    .transform((value) => value.slice(0, maxTitleStringLength))
    .optional(),

  permissions: permissionsSchema.optional(),
}
const threads = defineEnt(zodToConvexFields(threadsFields))
  .deletion('soft')
  .edges('messages', { ref: true })
  .edge('user')

//* Users
export const usersFields = {
  name: z.string(),
  imageUrl: z.string(),
  role: z.enum(['user', 'admin']),
}
const users = defineEnt(zodToConvexFields(usersFields))
  .deletion('soft')
  .field('tokenIdentifier', zodToConvex(z.string()), { unique: true })
  .edges('users_api_keys', { ref: true })
  .edges('threads', { ref: true })

export const usersApiKeysFields = {
  valid: z.boolean(),
}
const users_api_keys = defineEnt(zodToConvexFields(usersApiKeysFields))
  .deletion('soft')
  .field('secret', zodToConvex(z.string()), { unique: true })
  .edge('user')

//* Schema
const schema = defineEntSchema(
  {
    images,
    messages,
    threads,
    users,
    users_api_keys,
  },
  { schemaValidation: false },
)

export default schema
export const entDefinitions = getEntDefinitions(schema)
