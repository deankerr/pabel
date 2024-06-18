import { zid } from 'convex-helpers/server/zod'
import { z } from 'zod'

import { internal } from '../_generated/api'
import { getVoiceModelsHelper } from '../db/voiceModels'
import { internalAction } from '../functions'
import { createOpenAiClient } from '../lib/openai'
import { getErrorMessage } from '../shared/utils'

import type OpenAI from 'openai'

export const runNow = internalAction({
  args: {
    speechFileId: zid('speech_files'),
    text: z.string(),
    textHash: z.string(),
    resourceKey: z.string(),
  },
  handler: async (ctx, args) => {
    try {
      const voiceModels = getVoiceModelsHelper()
      const voice = voiceModels.find(
        (model) => model.resourceKey === args.resourceKey,
      )?.endpointModelId

      const api = createOpenAiClient('openai')
      const mp3 = await api.audio.speech.create({
        model: 'tts-1',
        voice: (voice ?? 'alloy') as OpenAI.Audio.Speech.SpeechCreateParams['voice'],
        input: args.text,
      })

      const blob = await mp3.blob()
      const fileId = await ctx.storage.store(blob)
      const fileUrl = (await ctx.storage.getUrl(fileId)) || ''

      await ctx.runMutation(internal.db.speechFiles.update, {
        speechFileId: args.speechFileId,
        fileId,
        fileUrl,
        status: 'complete',
      })
    } catch (err) {
      console.error(err)
      await ctx.runMutation(internal.db.speechFiles.update, {
        speechFileId: args.speechFileId,
        status: 'error',
        error: getErrorMessage(err),
      })
    }
  },
})
