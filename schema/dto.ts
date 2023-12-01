import z from 'zod'

//* PUBLIC

export type Vendor = z.infer<typeof vendorSchema>
export type Engine = z.infer<typeof engineSchema>
export type InferenceParameters = z.infer<typeof inferenceParametersSchema>
export type InferenceParametersRecord = z.infer<typeof inferenceParametersRecordSchema>
export type Agent = z.infer<typeof agentSchema>
export type CreateAgent = z.infer<typeof createAgentSchema>
export type UpdateAgent = z.infer<typeof updateAgentSchema>
export type DeleteAgent = z.infer<typeof deleteAgentSchema>

export const vendorSchema = z.object({
  id: z.string(),
  displayName: z.string(),
  url: z.string(),
})

const engineSchema = z.object({
  id: z.string(),
  category: z.string(), //? enum
  model: z.string(),
  isAvailable: z.boolean(),
  isRestricted: z.boolean(),
  displayName: z.string(),
  creatorName: z.string(),
  costInputNanoUsd: z.number(),
  costOutputNanoUsd: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),

  vendorId: z.string(),
  vendor: vendorSchema,
  vendorModelId: z.string(),

  description: z.string().nullable(),
  url: z.string().nullable(),
  license: z.string().nullable(),
  contextLength: z.number().nullable(),
  promptFormat: z.string().nullable(),
  comment: z.string().nullable(),
  instructType: z.string().nullable(),
  outputTokenLimit: z.number().nullable(),
  tokenizer: z.string().nullable(),
  stopTokens: z.string().array().nullable(),
  parameterSize: z.number().nullable(),
})

export const inferenceParametersSchema = z
  .object({
    temperature: z.number(),
    max_tokens: z.number(),
    frequency_penalty: z.number(),
    presence_penalty: z.number(),
    repetition_penalty: z.number(),
    top_p: z.number(),
    top_k: z.number(),
    stop: z.string().array(),
    stop_token: z.string(),
  })
  .partial()

export const inferenceParametersRecordSchema = z.record(inferenceParametersSchema)

export const agentSchema = z.object({
  id: z.string(),

  createdAt: z.date(),
  updatedAt: z.date(),

  name: z.string(),
  image: z.string(),

  engineId: z.string(),
  engine: engineSchema,
  engineParameters: inferenceParametersRecordSchema,
})

export const createAgentSchema = z.object({
  name: z.string(),
})

export const updateAgentSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  engineId: z.string().optional(),
  engineParameters: inferenceParametersRecordSchema.optional(),
})

export const deleteAgentSchema = z.object({
  id: z.string(),
})
