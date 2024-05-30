import FalModels from '../endpoints/fal.models.json'
import { OpenAIChatModels } from '../endpoints/openai'
import OpenRouterModels from '../endpoints/openrouter.models.json'
import SinkinModels from '../endpoints/sinkin.models.json'
import TogetherModels from '../endpoints/together.models.json'

import type { EChatModel, EImageModel } from './structures'

const excludeChatModels = [
  'openai/gpt-3.5-turbo-0125',
  'openai/gpt-3.5-turbo-0301',
  'openai/gpt-3.5-turbo-0613',
  'openai/gpt-3.5-turbo-1106',
  'openai/gpt-4-0314',
  'openai/gpt-4-1106-preview',
  'openai/gpt-4-32k-0314',
  'openai/gpt-4-turbo-preview',
  'openai/gpt-4o-2024-05-13',
  'openrouter/auto',
  'meta-llama/llama-guard-2-8b',
]

export const chatModels: EChatModel[] = [
  OpenAIChatModels.map((model) => ({
    modelType: 'chat' as const,
    endpoint: 'openai',
    endpointModelId: model.model_id,
    name: `OpenAI: ${model.name}`,
    creatorName: 'OpenAI',
    contextLength: model.contextLength,
  })),
  OpenRouterModels.map((model) => ({
    modelType: 'chat' as const,
    endpoint: 'openrouter',
    endpointModelId: model.id,
    name: model.name,
    contextLength: model.context_length,
  })),
  TogetherModels.map((model) => ({
    modelType: 'chat' as const,
    endpoint: 'together',
    endpointModelId: model.model_id,
    name: model.name,
    contextLength: model.contextLength,
  })),
]
  .flat()
  .filter((model) => !excludeChatModels.includes(model.endpointModelId))
  .map((model) => ({ ...model, resourceId: `${model.endpoint}::${model.endpointModelId}` }))
  .sort((a, b) => a.name.localeCompare(b.name))

const falIncludeModels = [
  'fal-ai/hyper-sdxl',
  'fal-ai/fast-lightning-sdxl',
  'fal-ai/pixart-sigma',
  // 'fal-ai/lora',
]

export const imageModels: EImageModel[] = [
  FalModels.filter((model) => falIncludeModels.includes(model.model_id)).map((model) => ({
    modelType: 'image' as const,
    endpoint: 'fal',
    endpointModelId: model.model_id,
    name: model.name,
  })),
  SinkinModels.map((model) => ({
    modelType: 'image' as const,
    endpoint: 'sinkin',
    endpointModelId: model.model_id,
    name: model.name,
  })),
]
  .flat()
  .map((model) => ({ ...model, resourceId: `${model.endpoint}::${model.endpointModelId}` }))