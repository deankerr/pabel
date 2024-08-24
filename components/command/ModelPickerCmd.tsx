import { useState } from 'react'
import { Dialog } from '@radix-ui/themes'

import { CmdK } from '@/components/command/CmdK'
import { ModelLogo } from '@/components/icons/ModelLogo'
import { useModels } from '@/lib/api'
import { cn } from '@/lib/utils'

import type { EChatModel, EImageModel } from '@/convex/types'

export const ModelPickerCmd = ({
  type,
  value,
  onValueChange,
  children,
}: {
  type?: 'chat' | 'image'
  value: string
  onValueChange: (value: string) => unknown
  children?: React.ReactNode
}) => {
  const { chatModels, imageModels, model } = useModels(value)
  const modelSet = model?.type ?? type
  const showChatModels = modelSet === 'chat' || !modelSet
  const showImageModels = modelSet === 'image' || !modelSet

  const [open, setOpen] = useState(false)
  const handleSelect = (value: string) => {
    onValueChange(value)
    setOpen(false)
  }
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>{children}</Dialog.Trigger>
      <Dialog.Content
        align="start"
        maxWidth="42rem"
        className="rounded-md p-0"
        aria-describedby={undefined}
      >
        <Dialog.Title className="sr-only">Model Picker</Dialog.Title>
        <CmdK tabIndex={0} className="bg-gray-2">
          <CmdK.Input placeholder="Search models..." />
          <CmdK.List>
            <CmdK.Empty>No models found</CmdK.Empty>

            {model && (
              <CmdK.Group heading="Current">
                <ModelItem
                  key={model.resourceKey}
                  value={`current ${model.resourceKey}`}
                  onSelect={() => handleSelect(model.resourceKey)}
                  model={model}
                />
              </CmdK.Group>
            )}

            {showChatModels && (
              <CmdK.Group heading="Chat Models">
                {chatModels?.map((model) => (
                  <ModelItem
                    key={model.resourceKey}
                    value={model.resourceKey}
                    onSelect={() => handleSelect(model.resourceKey)}
                    model={model}
                  />
                ))}
              </CmdK.Group>
            )}

            {showImageModels && (
              <CmdK.Group heading="Image Models">
                {imageModels?.map((model) => (
                  <ModelItem
                    key={model.resourceKey}
                    value={model.resourceKey}
                    onSelect={() => handleSelect(model.resourceKey)}
                    model={model}
                  />
                ))}
              </CmdK.Group>
            )}
          </CmdK.List>
        </CmdK>
      </Dialog.Content>
    </Dialog.Root>
  )
}

const ModelItem = ({
  model,
  className,
  ...props
}: { model: EChatModel | EImageModel } & React.ComponentProps<typeof CmdK.Item>) => {
  return (
    <CmdK.Item {...props} className={cn('font-medium aria-selected:text-orange-11', className)}>
      <div className="mr-2 shrink-0">
        <ModelLogo modelName={model.name} size={20} />
      </div>
      <div className="truncate">{model.name}</div>
      <div className="grow" />

      {!model.available && <div className="text-xs text-red-11">Not available</div>}
      {model.pricing.type === 'llm' ? (
        <div className="flex w-20 shrink-0 justify-evenly gap-2 text-right text-xs tabular-nums">
          <div className="text-right">{model.pricing.tokenInput.toFixed(2)}</div>
          <div className="text-right">{model.pricing.tokenOutput.toFixed(2)}</div>
        </div>
      ) : model.pricing.type === 'free' ? (
        <div className="flex shrink-0 gap-1 text-xs tabular-nums">
          <div className="w-20 text-center text-grass-11">free</div>
        </div>
      ) : null}
      <div className="w-16 shrink-0 text-center text-xs">{model.endpoint}</div>
    </CmdK.Item>
  )
}
