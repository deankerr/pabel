import { zid } from 'convex-helpers/server/zod'
import { z } from 'zod'

import { generationProviders } from './constants'
import {
  generatedImageFields,
  generationFields,
  messageFields,
  ridField,
  threadFields,
  userFields,
} from './schema'

import type { generationVoteNames } from './constants'

const ridFields = {
  rid: ridField,
  private: z.boolean(),
}

const units = {
  appImage: z
    .object({
      _id: zid('app_images'),
      _creationTime: z.number(),
      width: z.number(),
      height: z.number(),
      blurDataUrl: z.string(),
      color: z.string(),
    })
    .describe('external'),

  generated_image: z
    .object({
      ...generatedImageFields,
      ...ridFields,
      deletionTime: z.undefined().optional(),
      _creationTime: z.number(),
      _id: zid('generated_images'),
    })
    .omit({ sourceUrl: true, sourceFileId: true })
    .describe('external'),

  generation: z
    .object({
      ...generationFields,
      ...ridFields,
      deletionTime: z.undefined().optional(),
      votes: z.record(z.string(), z.number()),
      _creationTime: z.number(),
      _id: zid('generations'),
    })
    .describe('external'),

  message: z
    .object({
      ...messageFields,
      ...ridFields,
      _creationTime: z.number(),
      _id: zid('messages'),
      deletionTime: z.undefined().optional(),
    })
    .describe('external'),

  models: z
    .object({
      model_id: z.string(),
      name: z.string(),
      provider: z.enum(generationProviders),
      resId: z.string(),
    })
    .describe('external'),

  thread: z
    .object({
      ...threadFields,
      ...ridFields,
      _creationTime: z.number(),
      _id: zid('threads'),
      deletionTime: z.undefined().optional(),
    })
    .describe('external'),

  user: z
    .object({
      ...userFields,
      rid: z.string(),
      _creationTime: z.number(),
      _id: zid('users'),
      deletionTime: z.undefined().optional(),
    })
    .describe('external'),
}

const generationWithImage = units.generation
  .merge(
    z.object({
      image: units.generated_image.nullable(),
    }),
  )
  .describe('external xl')

const modelXL = units.models
  .merge(
    z.object({
      image: units.appImage.nullable(),
    }),
  )
  .describe('external xl')

const messageXL = z
  .object({
    message: units.message,
    generations: generationWithImage.array().nullable(),
  })
  .describe('external xl')

export const external = {
  unit: units,
  xl: {
    generation: generationWithImage,
    model: modelXL,
    message: messageXL,
  },
}

export type AppImage = z.infer<typeof units.appImage>
export type Generation = z.infer<typeof generationWithImage>
export type GeneratedImage = z.infer<typeof units.generated_image>
export type GenerationVoteNames = (typeof generationVoteNames)[number]
export type MessageContent = z.infer<typeof messageXL>
export type Model = z.infer<typeof units.models>
export type ModelContent = z.infer<typeof modelXL>
export type Thread = z.infer<typeof units.thread>
