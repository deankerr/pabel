import { createErrorResponse, raise } from '@/lib/utils'
import OpenAI from 'openai'

const api = new OpenAI()

export const openai = {
  async chat(input: OpenAI.Chat.ChatCompletionCreateParamsNonStreaming) {
    const response = await api.chat.completions.create(input)
    const item = response.choices[0]?.message.content ?? raise('response missing expected data')
    return { response, item }
  },

  async image(input: OpenAI.ImageGenerateParams) {
    try {
      const response = await api.images.generate(input)
      const item = { url: response.data[0]?.url ?? raise('response missing expected url') }
      return { response, item }
    } catch (error) {
      if (error instanceof OpenAI.APIError) {
        const { status, message } = error
        return createErrorResponse({ status, message })
      } else {
        throw error
      }
    }
  },
}
