import { Label } from '@/app/components/ui/Label'
import { api } from '@/convex/_generated/api'
import { cn } from '@/lib/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { Select, Slider } from '@radix-ui/themes'
import { useQuery } from 'convex/react'
import { forwardRef } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

type Props = {
  onSubmitSuccess: (values: FormSchema) => void
}

const formSchema = z.object({
  model: z.string().min(1),
  max_tokens: z.number().min(1).max(2048).step(1),
  temperature: z.number().min(0).max(2).step(0.1),
  top_p: z.number().min(0).max(1).step(0.1),
  top_k: z.number().min(1).max(100).step(1),
  repetition_penalty: z.number().min(1).max(2).step(0.01),
})
export type FormSchema = z.infer<typeof formSchema>

export const LlmParametersForm = forwardRef<HTMLFormElement, Props & React.ComponentProps<'form'>>(
  function LlmParametersForm({ onSubmitSuccess, className, ...props }, forwardedRef) {
    const { control, handleSubmit } = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        max_tokens: 512,
        temperature: 0.7,
        top_p: 0.7,
        top_k: 50,
        repetition_penalty: 1,
      },
    })

    const submit = handleSubmit(onSubmitSuccess, (errors) => {
      console.error(errors)
      toast.error('Form validation error')
    })

    const textModels = useQuery(api.threads.models.list)

    return (
      <form
        {...props}
        className={cn('', className)}
        ref={forwardedRef}
        onSubmit={(e) => void submit(e)}
      >
        <Controller
          name="model"
          control={control}
          render={({ field: { value, onChange, ref, name, ...fieldProps } }) => (
            <div className="flex flex-col gap-1 p-3">
              <Label htmlFor={name}>Model</Label>
              <Select.Root
                {...fieldProps}
                name={name}
                value={value}
                onValueChange={(v) => onChange(v)}
              >
                <Select.Trigger placeholder="Select a model" ref={ref} />
                <Select.Content>
                  {textModels && (
                    <>
                      <Select.Group>
                        <Select.Label>Chat</Select.Label>
                        {textModels.chat.map((model) => (
                          <Select.Item key={model.reference} value={model.reference}>
                            {model.name}
                          </Select.Item>
                        ))}
                      </Select.Group>
                      <Select.Separator />
                      <Select.Group>
                        <Select.Label>Completion</Select.Label>
                        {textModels.completion.map((model) => (
                          <Select.Item key={model.reference} value={model.reference}>
                            {model.name}
                          </Select.Item>
                        ))}
                      </Select.Group>
                    </>
                  )}
                </Select.Content>
              </Select.Root>
            </div>
          )}
        />

        <Controller
          name="max_tokens"
          control={control}
          render={({ field: { onChange, value, name, ...fieldProps } }) => (
            <div className="flex flex-col gap-1.5 p-3">
              <div className="flex items-center justify-between">
                <Label htmlFor={name}>Max tokens</Label>
                <div className="text-sm">{value}</div>
              </div>
              <Slider
                {...fieldProps}
                name={name}
                min={1}
                max={2048}
                value={[value]}
                onValueChange={([v]) => onChange(v)}
                className="cursor-pointer"
              />
            </div>
          )}
        />

        <Controller
          name="temperature"
          control={control}
          render={({ field: { onChange, value, name, ...fieldProps } }) => (
            <div className="flex flex-col gap-1.5 p-3">
              <div className="flex items-center justify-between">
                <Label htmlFor={name}>Temperature</Label>
                <div className="text-sm">{value}</div>
              </div>
              <Slider
                {...fieldProps}
                name={name}
                min={0}
                max={2}
                step={0.1}
                value={[value]}
                onValueChange={([v]) => onChange(v)}
                className="cursor-pointer"
              />
            </div>
          )}
        />

        <Controller
          name="top_p"
          control={control}
          render={({ field: { onChange, value, name, ...fieldProps } }) => (
            <div className="flex flex-col gap-1.5 p-3">
              <div className="flex items-center justify-between">
                <Label htmlFor={name}>Top-P</Label>
                <div className="text-sm">{value}</div>
              </div>
              <Slider
                {...fieldProps}
                name={name}
                min={0}
                max={1}
                step={0.1}
                value={[value]}
                onValueChange={([v]) => onChange(v)}
                className="cursor-pointer"
              />
            </div>
          )}
        />

        <Controller
          name="top_k"
          control={control}
          render={({ field: { onChange, value, name, ...fieldProps } }) => (
            <div className="flex flex-col gap-1.5 p-3">
              <div className="flex items-center justify-between">
                <Label htmlFor={name}>Top-K</Label>
                <div className="text-sm">{value}</div>
              </div>
              <Slider
                {...fieldProps}
                name={name}
                min={1}
                max={100}
                step={1}
                value={[value]}
                onValueChange={([v]) => onChange(v)}
                className="cursor-pointer"
              />
            </div>
          )}
        />

        <Controller
          name="repetition_penalty"
          control={control}
          render={({ field: { onChange, value, name, ...fieldProps } }) => (
            <div className="flex flex-col gap-1.5 p-3">
              <div className="flex items-center justify-between">
                <Label htmlFor={name}>Repetition penalty</Label>
                <div className="text-sm">{value}</div>
              </div>
              <Slider
                {...fieldProps}
                name={name}
                min={1}
                max={2}
                step={0.01}
                value={[value]}
                onValueChange={([v]) => onChange(v)}
                className="cursor-pointer"
              />
            </div>
          )}
        />
      </form>
    )
  },
)