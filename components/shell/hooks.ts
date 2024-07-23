import { useAtom, useAtomValue, useSetAtom } from 'jotai'

import {
  shellNewThreadInferenceConfig,
  shellOpenAtom,
  shellSearchValueAtom,
  shellSelectedModelAtom,
  shellSelectedThreadIdAtom,
  shellStackAtom,
} from '@/components/shell/atoms'
import { defaultChatInferenceConfig, defaultImageInferenceConfig } from '@/convex/shared/defaults'
import { useUserThreadsList } from '@/lib/queries'

import type { ShellPage } from '@/components/shell/Shell'
import type { Id } from '@/convex/_generated/dataModel'
import type { EThread } from '@/convex/types'

export const useIsCurrentPage = (page: ShellPage) => {
  const stack = useAtomValue(shellStackAtom)
  return stack.at(-1) === page
}

export const useShellStack = () => {
  const [stack, setStack] = useAtom(shellStackAtom)
  const setSearchValue = useSetAtom(shellSearchValueAtom)

  const current = stack.at(-1)

  const push = (page: ShellPage) => {
    setStack([...stack, page])
    setSearchValue('')
  }

  const pop = () => {
    setStack(stack.slice(0, -1))
  }

  const set = (page: ShellPage) => {
    setStack([page])
    setSearchValue('')
  }

  const clear = () => {
    setStack([])
    setSearchValue('')
  }

  return { stack, push, pop, set, clear, current }
}

export const useShellUserThreads = () => {
  const list = useUserThreadsList()
  const [selectedThreadId, setSelectedThreadId] = useAtom(shellSelectedThreadIdAtom)

  const current = list ? (list.find((t) => t._id === selectedThreadId) ?? null) : undefined

  const select = (thread: EThread | null) => {
    setSelectedThreadId(thread?._id ?? null)
  }

  return { list, select, current }
}

export const useShellActions = () => {
  const setOpen = useSetAtom(shellOpenAtom)
  const setStack = useSetAtom(shellStackAtom)
  const setSelectedThreadId = useSetAtom(shellSelectedThreadIdAtom)
  const setNewThreadInferenceConfig = useSetAtom(shellNewThreadInferenceConfig)
  const setSelectedModel = useSetAtom(shellSelectedModelAtom)

  const open = ({ threadId }: { threadId?: string } = {}) => {
    setOpen(true)

    if (threadId) {
      setSelectedThreadId(threadId)
      setStack(['ThreadConfig'])
    } else {
      setStack([])
    }
  }

  const close = () => {
    setOpen(false)
    setStack([])
    setSelectedThreadId(null)
    setNewThreadInferenceConfig(null)
    setSelectedModel(null)
  }

  const createChat = () => {
    setOpen(true)
    setStack(['CreateThread'])
    setSelectedThreadId(null)
    setNewThreadInferenceConfig(defaultChatInferenceConfig)
    setSelectedModel(defaultChatModel)
  }

  const createImage = () => {
    setOpen(true)
    setStack(['CreateThread'])
    setSelectedThreadId(null)
    setNewThreadInferenceConfig(defaultImageInferenceConfig)
    setSelectedModel(defaultImageModel)
  }

  return { open, close, createChat, createImage }
}

const defaultChatModel = {
  _creationTime: 1720631474117.6956,
  _id: '__default_chat_model__' as Id<'chat_models'>,
  available: true,
  contextLength: 128000,
  creatorName: 'OpenAI',
  description: '',
  endpoint: 'openai',
  endpointModelId: 'gpt-4o',
  hidden: false,
  internalScore: 17,
  license: '',
  link: 'https://openai.com/',
  moderated: false,
  name: 'GPT-4o',
  numParameters: 0,
  pricing: {},
  resourceKey: 'openai::openai/gpt-4o',
  stop: [],
  tags: ['flagship', 'multimodal'],
  tokenizer: 'GPT',
  type: 'chat' as const,
}

const defaultImageModel = {
  _creationTime: 1720631474117.6956,
  _id: '__default_image_model__' as Id<'image_models'>,
  architecture: 'SD3' as const,
  available: true,
  creatorName: '',
  description: '',
  endpoint: 'fal',
  endpointModelId: 'fal-ai/stable-diffusion-v3-medium',
  hidden: false,
  internalScore: 1,
  license: '',
  link: '',
  moderated: false,
  name: 'Stable Diffusion V3 Medium',
  pricing: {},
  resourceKey: 'fal::fal-ai/stable-diffusion-v3-medium',
  sizes: {
    landscape: [1216, 832],
    portrait: [832, 1216],
    square: [1024, 1024],
  },
  tags: [],
  type: 'image' as const,
}
