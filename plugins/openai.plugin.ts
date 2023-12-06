import 'server-only'
import { ENV } from '@/lib/env'
import { RouteContext } from '@/lib/route'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import OpenAI from 'openai'
import { openaiSchema } from './openai.schema'

const api = new OpenAI({
  apiKey: ENV.OPENAI_API_KEY,
})

export const openaiPlugin = {
  chat: {
    completions: async ({ input, log }: RouteContext) => {
      const body = openaiSchema.chat.completions.request.parse(input)
      log.add('vendorRequestBody', body)

      //* streaming response
      if (body.stream) {
        const response = await api.chat.completions.create(
          body as OpenAI.ChatCompletionCreateParamsStreaming,
        )
        const stream = OpenAIStream(response)
        log.add('vendorResponseBody', 'is_streaming')
        return new StreamingTextResponse(stream)
      }

      //* json response
      const response = await api.chat.completions.create(
        body as OpenAI.ChatCompletionCreateParamsNonStreaming,
      )
      log.add('vendorResponseBody', response)
      return Response.json(response)
    },
  },

  moderations: async ({ input }: { input: unknown }) => {
    const body = openaiSchema.moderations.request.parse(input)
    const response = await api.moderations.create(body)
    return Response.json(response)
  },

  images: {
    generations: async ({ input }: { input: unknown }) => {
      console.log('openai image generation')
      const body = openaiSchema.image.generations.request.parse(input)
      const response = await api.images.generate(body)
      return Response.json(response)
    },
  },
}

export async function getAvailableModels() {
  const { data } = await api.models.list()
  return data
}

/* 
async function chatModerated(chatRequest: EChatRequestSchema) {
  try {
    console.log('request moderation')
    const body = schemas.openai.chat.input.parse(chatRequest)
    const messages = body.messages.map((m) => `${m.content}`)
    const response = await api.moderations.create({ input: messages })
    const flagged = body.messages.filter((_, i) => response.results[i]?.flagged)

    if (flagged.length === 0) {
      console.log('allow')
      return chat(chatRequest)
    } else {
      console.warn(flagged, 'reject')
      const message = `OpenAI Moderation rejected: ${flagged
        .map((m) => `"${m.content}"`)
        .join(', ')}`
      return createErrorResponse(message, 403)
    }
  } catch (err) {
    return handleChatError(err)
  }
}






*/
