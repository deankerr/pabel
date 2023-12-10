import 'server-only'
import { ChatRouteResponse } from '@/app/api/v1/chat/completions/route'
import { Message, messageSchema } from '@/data/schemas'
import { NewAppError } from '@/lib/app-error'
import { t } from '@/lib/drizzle'
import { ENV } from '@/lib/env'
import { RouteContext } from '@/lib/route'
import { invariant, nanoUSDToDollars } from '@/lib/utils'
import { nanoid } from 'nanoid/non-secure'
import createClient from 'openapi-fetch'
import z from 'zod'
import type { paths } from './togetherai.api'
import { togetheraiSchema } from './togetherai.schema'

const vendorId = 'togetherai' as const

const { GET, POST } = createClient<paths>({
  baseUrl: 'https://api.together.xyz',
  headers: {
    Authorization: `Bearer ${ENV.TOGETHERAI_API_KEY}`,
  },
})

export const togetheraiPlugin = {
  chat: {
    completions: async ({ input, log }: RouteContext) => {
      const { messages, ...rest } = togetheraiSchema.chat.completions.request
        .merge(z.object({ messages: messageSchema.array() }))
        .parse(input)
      const prompt = convertMessagesToPromptFormat(messages)

      //^ streaming disabled
      const body = { ...rest, prompt, stream_tokens: false }
      log.add('vendorRequestBody', body)

      const { data, error } = await POST('/inference', {
        body,
      })

      if (data) {
        //* streaming response
        if (rest.stream_tokens) {
          //* just return the completion text until streaming implemented
          const { message } = parseChatResponse(data)
          log.add('vendorResponseBody', message.text)
          return new Response(message.text)
        }

        //* json response
        const { response, message } = parseChatResponse(data)
        log.add('vendorResponseBody', response)

        const res: ChatRouteResponse = {
          _raw: data,
          id: 'tog-' + nanoid(5),
          object: 'chat.completion',
          created: Date.now(),
          model: response.model,
          system_fingerprint: '',
          choices: [
            {
              index: 0,
              message: {
                role: 'assistant',
                content: message.text,
              },
              finish_reason: message.finish_reason ?? '',
            },
          ],
          usage: {
            prompt_tokens: 0,
            completion_tokens: 0,
            total_tokens: 0,
          },
        }

        log.add('responseBody', res)
        return Response.json(res)
      }

      throw new NewAppError('vendor_response_error', { cause: error })
    },
  },

  images: {
    generations: async (ctx: RouteContext) => {
      //* models: runwayml/stable-diffusion-v1-5 stabilityai/stable-diffusion-2-1 SG161222/Realistic_Vision_V3.0_VAE prompthero/openjourney wavymulder/Analog-Diffusion
      const input = togetheraiSchema.images.generations.request.parse(ctx.input)
      ctx.log.add('venderRequestBody', input)

      //* openapi spec missing image parameters
      const { data, error } = await POST('/inference', { body: input })
      ctx.log.add('vendorResponseBody', data)

      if (data) {
        const result = togetheraiSchema.images.generations.response.parse(data)
        const apiResponse = {
          created: Date.now(),
          data: result.output.choices.map((choice) => ({
            b64_json: choice.image_base64,
          })),
        }
        ctx.log.add('responseBody', apiResponse)
        return Response.json(apiResponse)
      } else {
        throw new NewAppError('vendor_response_error', { cause: error })
      }
    },
  },

  models: {
    list: async () => {
      const { data, error } = await GET('/models/info', {})
      if (!data) throw new Error('openapi-fetch error', error)
      return data
    },

    processList: (listData: unknown) => {
      const parse = togetheraiSchema.models.list.safeParse(listData)
      if (!parse.success) return console.warn('%s failed to parse list: %o', vendorId, parse.error)
      console.log('openrouter: %d items', parse.data.length)

      const results = []

      for (const item of parse.data) {
        console.log('%s: %s', vendorId, item.name)

        const model = {
          id: item.name.toLowerCase(),
          category: item.display_type,
          name: item.display_name,
          creatorName: item.creator_organization,
          contextLength: item.context_length,
          parameterSize: item.num_parameters ? String(item.num_parameters) : undefined,
          url: item.link,
          description: item.description,
          license: item.license,
        } satisfies Partial<typeof t.models.$inferInsert>

        const resource = {
          id: 'togetherai@' + item.name.toLowerCase(),
          modelAliasId: item.name.toLowerCase(),
          vendorId: 'togetherai',
          isRestricted: false,
          isAvailable: true,
          endpointModelId: item.name,
          inputCost1KTokens: nanoUSDToDollars(item.pricing.input) || -1, //* are not free
          outputCost1KTokens: nanoUSDToDollars(item.pricing.output) || -1, //* price not provided
          vendorModelData: model,
          tokenOutputLimit: null,
        } satisfies typeof t.resources.$inferInsert
        results.push(resource)
      }

      return results
    },
  },
}

function convertMessagesToPromptFormat(messages: Message[]) {
  let prompt = ''
  for (const m of messages) {
    if (m.role === 'system') prompt = prompt.concat(m.content + '\n')
    if (m.role === 'user') prompt = prompt.concat('<human>: ' + m.content + '\n')
    if (m.role === 'assistant') prompt = prompt.concat('<bot>: ' + m.content + '\n')
  }
  prompt = prompt.concat('<bot>:')

  return prompt
}

function parseChatResponse(data: unknown) {
  try {
    const response = togetheraiSchema.chat.completions.response.parse(data)
    const message = response.output.choices[0]
    invariant(message)
    return { response, message }
  } catch (err) {
    throw new NewAppError('validation_vendor_response', { description: 'together.ai', cause: data })
  }
}

export async function getAvailableModels() {
  console.log('fetching togetherai model list')
  const { data, error } = await GET('/models/info', {})
  console.log('data', data)
  if (error) console.error('openapi-fetch error', error)
  return data
}
