import { Agent } from '@/lib/schemas'
import { Engine } from '@prisma/client'
import { useChat } from 'ai/react'
import { nanoid } from 'nanoid/non-secure'
import { toast } from 'sonner'

const endpoint = '/api/chat'

export function useAgentChat(chatId: string, agent: Agent | undefined, engine: Engine | undefined) {
  const initialMessages = agent
    ? [
        {
          id: nanoid(5),
          role: `system` as const,
          content: `You are an AI assistant named ${agent.name}.`,
        },
      ]
    : []

  const body: Record<string, unknown> =
    agent && engine
      ? {
          model: engine.providerModelId,
          engineId: agent.engineId,
        }
      : {}

  if (agent && engine) {
    // console.log('agentchat ready')
    const parameters = agent.parameters[agent.engineId]
    if (parameters && parameters.fieldsEnabled) {
      for (const key of parameters.fieldsEnabled) {
        const param = parameters[key as keyof typeof parameters]
        if (param) body[key] = param
      }
    }
  }

  const chat = useChat({
    id: chatId,
    api: endpoint,
    body,
    initialMessages,
    onResponse: (response) => {
      console.log('[response]', response)
    },
    onFinish: (message) => {
      console.log('[finish]', message)
    },
    onError: (error) => {
      console.error('[error]', error)
      toast.error(error.message)
    },
  })

  const streamingId =
    chat.isLoading && chat.messages.at(-1)?.role === 'assistant'
      ? chat.messages.at(-1)?.id
      : undefined

  const submitUserMessage = (content: string) => {
    chat.append({ role: 'user', content })
  }

  return { ...chat, submitUserMessage, streamingId }
}

export type AgentChatHelpers = ReturnType<typeof useAgentChat>
