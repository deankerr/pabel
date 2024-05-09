import { useMutation } from 'convex/react'
import { toast } from 'sonner'
import { z } from 'zod'
import { zfd } from 'zod-form-data'

import { useCurrentModelAtom, useGenerationQuantity } from '@/components/command-bar/atoms'
import { api } from '@/convex/_generated/api'
import { imageGenerationSizesMap } from '@/convex/constants'
import { useThreadCtx } from '@/lib/queries'

const formSchema = zfd.formData({
  prompt: zfd.text(),
  negative_prompt: zfd.text(z.string().optional()),

  seed: zfd.numeric(z.number().optional()),
  scale: zfd.numeric(z.number().optional()),
  guidance_scale: zfd.numeric(z.number().optional()),
  steps: zfd.numeric(z.number().optional()),
  num_inference_steps: zfd.numeric(z.number().optional()),

  scheduler: zfd.text(z.string().optional()),
  style: zfd.text(z.string().optional()),

  lcm: zfd.checkbox().optional(),
  use_default_neg: zfd.checkbox().optional(),

  expand_prompt: zfd.checkbox().optional(),
  enable_safety_checker: zfd.checkbox().optional(),

  dimensions: zfd.repeatable(z.string().array().min(1)),
})

export const useGenerationForm = () => {
  const [currentModel] = useCurrentModelAtom()
  const [quantity] = useGenerationQuantity()
  const thread = useThreadCtx()

  const send = useMutation(api.messages.create)

  // eslint-disable-next-line @typescript-eslint/require-await
  const formAction = (formData: FormData) => {
    if (!currentModel || !thread) return

    const form = formSchema.safeParse(formData)
    if (!form.success) {
      toast.error('Form validation failed')
      console.error(form.error.issues)
      return
    }

    toast.success('Form validation success')
    console.log(form.data)

    const { dimensions, prompt, seed, ...rest } = form.data
    //TODO temp: remove unsupported params
    const generation = {
      prompt,
      seed,
      provider: currentModel.provider,
      model_id: currentModel.model_id,
      entries: Object.entries(rest).filter(([_, value]) => value !== undefined),
      sizes: dimensions.map((size) => ({ size, n: Number(quantity) })) as Array<{
        size: keyof typeof imageGenerationSizesMap
        n: number
      }>,
    }

    send({
      message: {
        role: 'assistant',
        inference: {
          generation,
        },
      },
      threadId: thread._id,
    })
      .then(() => toast.success('generation started'))
      .catch((err) => {
        toast.error('An error occurred.')
        console.error(err)
      })
  }

  return { formAction }
}