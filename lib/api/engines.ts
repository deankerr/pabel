import { EChatEngine } from './schema'

export const engines: EChatEngine[] = [
  {
    id: 'openai::gpt-3.5-turbo',
    type: 'chat',
    platform: 'openai',
    model: 'gpt-3.5-turbo',
    messages: true,
    prompt: false,
    metadata: {
      label: 'OpenAI: GPT-3.5 Turbo',
      creator: 'OpenAI',
      description: 'GPT 3.5 from OpenAI',
      license: 'i dont know',
    },
    parameters: { model: 'gpt-3.5-turbo' },
  },
  {
    id: 'openrouter::meta-llama/llama-2-70b-chat',
    type: 'chat',
    platform: 'openrouter',
    model: 'llama-2-70b-chat',
    messages: true,
    prompt: true,
    metadata: {
      label: 'Meta: Llama v2 70B Chat',
      creator: 'Meta',
      description: 'Llama by Meta',
      license: 'i dont know',
    },
    parameters: { model: 'meta-llama/llama-2-70b-chat' },
  },
  {
    id: 'togetherai::togethercomputer/RedPajama-INCITE-7B-Chat',
    type: 'chat',
    platform: 'togetherai',
    model: 'RedPajama-INCITE-7B-Chat',
    messages: false,
    prompt: true,
    metadata: {
      label: 'Together.ai: RedPajama INCITE 7B Chat',
      creator: 'Together.ai',
      description: 'RedPajama is gonna INCITE some wicked chat',
      license: 'i dont know',
    },
    parameters: { model: 'togethercomputer/RedPajama-INCITE-7B-Chat' },
  },
]

export function getEngineById(id: string) {
  return engines.find((e) => e.id === id)
}

const chatModels = [
  {},
  {
    id: 'openai::gpt-4',
    provider: 'openai',
    label: 'OpenAI: GPT-4',
    parameters: { model: 'gpt-4' },
  },
  {
    id: 'openrouter::meta-llama/llama-2-70b-chat',
    provider: 'openrouter',
    label: 'Meta: Llama v2 70B Chat',
    parameters: { model: 'meta-llama/llama-2-70b-chat' },
  },
  {
    id: 'openrouter::jondurbin/airoboros-l2-70b',
    provider: 'openrouter',
    label: 'Airoboros L2 70B',
    parameters: { model: 'jondurbin/airoboros-l2-70b' },
  },
  {
    id: 'openrouter::migtissera/synthia-70b',
    provider: 'openrouter',
    label: 'Synthia 70B',
    parameters: { model: 'migtissera/synthia-70b' },
  },
  {
    id: 'openrouter::xwin-lm/xwin-lm-70b',
    provider: 'openrouter',
    label: 'Xwin 70B',
    parameters: { model: 'xwin-lm/xwin-lm-70b' },
  },
  {
    id: 'togetherai::togethercomputer/RedPajama-INCITE-7B-Chat',
    provider: 'togetherai',
    label: 'RedPajama INCITE 7B Chat',
    parameters: { model: 'togethercomputer/RedPajama-INCITE-7B-Chat' },
  },
] as const
