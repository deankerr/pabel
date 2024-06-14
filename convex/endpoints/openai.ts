import type { ChatModelDataRecord } from '../db/endpoints'

export const OpenAIChatModels = [
  {
    model_id: 'gpt-4o',
    name: 'GPT-4o',
    creatorName: 'OpenAI',
    contextLength: 128000,
  },
  {
    model_id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo with Vision',
    creatorName: 'OpenAI',
    contextLength: 128000,
  },
  {
    model_id: 'gpt-4',
    name: 'GPT-4',
    creatorName: 'OpenAI',
    contextLength: 8192,
  },
  {
    model_id: 'gpt-4-32k',
    name: 'GPT-4 32k',
    creatorName: 'OpenAI',
    contextLength: 32768,
  },
  {
    model_id: 'gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    creatorName: 'OpenAI',
    contextLength: 16385,
    outputMaxTokens: 4096,
  },
]

export const openaiChatModelData = [
  {
    slug: 'openai/gpt-4o',
    name: 'GPT-4o',
    description: '',

    creatorName: 'OpenAI',
    link: 'https://openai.com/',
    license: '',
    tags: [],

    numParameters: 0,
    contextLength: 128000,
    tokenizer: 'GPT',
    stop: [],

    model: 'gpt-4o',
    pricing: {},
  },
  {
    slug: 'openai/gpt-4-turbo',
    name: 'GPT-4 Turbo with Vision',
    description: '',

    creatorName: 'OpenAI',
    link: 'https://openai.com/',
    license: '',
    tags: [],

    numParameters: 0,
    contextLength: 128000,
    tokenizer: 'GPT',
    stop: [],

    model: 'gpt-4-turbo',
    pricing: {},
  },
  {
    slug: 'openai/gpt-4',
    name: 'GPT-4',
    description: '',

    creatorName: 'OpenAI',
    link: 'https://openai.com/',
    license: '',
    tags: [],

    numParameters: 0,
    contextLength: 8192,
    tokenizer: 'GPT',
    stop: [],

    model: 'gpt-4',
  },
  {
    slug: 'openai/gpt-4-32k',
    name: 'GPT-4 32k',
    description: '',

    creatorName: 'OpenAI',
    link: 'https://openai.com/',
    license: '',
    tags: [],

    numParameters: 0,
    contextLength: 32768,
    tokenizer: 'GPT',
    stop: [],

    model: 'gpt-4-32k',
  },
  {
    slug: 'openai/gpt-3.5-turbo',
    name: 'GPT-3.5 Turbo',
    description: '',

    creatorName: 'OpenAI',
    link: 'https://openai.com/',
    license: '',
    tags: [],

    numParameters: 0,
    contextLength: 16385,
    tokenizer: 'GPT',
    stop: [],

    model: 'gpt-3.5-turbo',
  },
]

export const getNormalizedModelData = () => {
  const models = openaiChatModelData.map(
    (raw): ChatModelDataRecord => ({
      ...raw,
      slug: `openai::${raw.slug}`,
      endpoint: 'openai',
      pricing: {},
      moderated: false,
      available: true,
      hidden: false,
    }),
  )

  return models
}

export const OpenAIImageModels = [
  {
    model_id: 'dall-e-3',
    name: 'dall-e-3',
    creatorName: 'OpenAI',
  },
  {
    model_id: 'dall-e-2',
    name: 'dall-e-2',
    creatorName: 'OpenAI',
  },
]
