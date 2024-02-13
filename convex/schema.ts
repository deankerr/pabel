import { defineEnt, defineEntSchema, getEntDefinitions } from 'convex-ents'
import { Infer, v } from 'convex/values'
import { modelBases, modelTypes, nsfwRatings } from './constants'
import { vEnum } from './util'

export type GenerationParameters = Infer<typeof generationParameters>

export const permissions = v.object({
  private: v.boolean(), // only visible by owner/author
  allowOnPublicFeeds: v.optional(v.boolean()),
  allowOtherUsersToEdit: v.optional(v.boolean()),
})

export const generationParameters = v.object({
  imageModelId: v.id('imageModels'),
  prompt: v.string(),
  negativePrompt: v.optional(v.string()),
  seed: v.optional(v.number()),
  scheduler: v.optional(v.string()),
  steps: v.optional(v.number()),
  guidance: v.optional(v.number()),
  lcm: v.optional(v.boolean()),
})

export const imagesFields = {
  storageId: v.optional(v.id('_storage')),
  url: v.optional(v.string()),

  sourceUrl: v.optional(v.string()),
  nsfw: vEnum(nsfwRatings),

  width: v.number(),
  height: v.number(),
  blurDataURL: v.string(),
  color: v.string(),
  metadata: v.any(),

  parameters: v.optional(generationParameters),
}

const generationsFields = {
  imageIds: v.array(v.id('images')),
}

export const imageModelFields = {
  name: v.string(),
  description: v.string(),
  base: vEnum(modelBases),
  type: vEnum(modelTypes),
  nsfw: vEnum(nsfwRatings),
  imageId: v.id('images'),
  tags: v.array(v.string()),

  civitaiId: v.optional(v.string()),
  huggingFaceId: v.optional(v.string()),

  sinkin: v.optional(
    v.object({
      refId: v.string(),
      hidden: v.optional(v.boolean()),
    }),
  ),

  hidden: v.optional(v.boolean()),
}

export const jobFields = {
  type: vEnum(['inference', 'generation', 'downloadImage']),
  status: vEnum(['pending', 'complete', 'error']),
  message: v.optional(v.string()),
  data: v.optional(v.any()),

  messageId: v.optional(v.id('messages')),
  imageId: v.optional(v.id('images')),
}

export const usersFields = {
  username: v.string(),
  avatar: v.string(),
  personal: v.object({
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
  }),
  admin: v.boolean(),
}

export const messageFields = {
  role: vEnum(['system', 'user', 'assistant']),
  name: v.optional(v.string()),
  content: v.string(),
}

export const inferenceParametersFields = {
  model: v.string(),
  max_tokens: v.optional(v.number()),
  stop: v.optional(v.array(v.string())),
  temperature: v.optional(v.number()),
  top_p: v.optional(v.number()),
  top_k: v.optional(v.number()),
  repetition_penalty: v.optional(v.number()),
}

export const messagesFields = {
  ...messageFields,
  inferenceParameters: v.optional(v.object(inferenceParametersFields)),
}

const schema = defineEntSchema(
  {
    apiKeys: defineEnt({
      secret: v.string(),
    })
      .edge('user', { field: 'ownerId' })
      .deletion('soft'),

    clerkWebhookEvents: defineEnt({
      body: v.string(),
      id: v.string(),
      type: v.string(),
    }).deletion('soft'),

    generations: defineEnt(generationsFields)
      .deletion('soft')
      .field('permissions', permissions, { default: { private: true } })
      .edge('user', { field: 'authorId' }),

    images: defineEnt(imagesFields)
      .deletion('soft')
      .field('permissions', permissions, { default: { private: true } })
      .index('sourceUrl', ['sourceUrl']),

    imageModels: defineEnt(imageModelFields)
      .deletion('soft')
      .field('order', v.number(), { index: true }),

    jobs: defineEnt(jobFields)
      .deletion('soft')
      .index('messageId', ['messageId'])
      .index('imageId', ['imageId']),

    messages: defineEnt(messagesFields).edge('thread', { field: 'threadId' }).deletion('soft'),

    threads: defineEnt({ name: v.string(), systemPrompt: v.string() })
      .edge('user', { field: 'ownerId' })
      .edges('messages', { ref: 'threadId', deletion: 'soft' })
      .deletion('soft'),

    users: defineEnt(usersFields)
      .deletion('soft')
      .edges('generations', { ref: 'authorId' })
      .edges('threads', { ref: 'ownerId' })
      .edge('apiKey', { optional: true, ref: 'ownerId' })
      .field('tokenIdentifier', v.string(), { index: true }),
  },
  { schemaValidation: false },
)

export default schema
export const entDefinitions = getEntDefinitions(schema)
