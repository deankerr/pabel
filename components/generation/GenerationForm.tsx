'use client'

import { useState } from 'react'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { Label as LabelPrimitive } from '@radix-ui/react-label'
import { RadioCards } from '@radix-ui/themes'
import { nanoid } from 'nanoid/non-secure'

import { RectangleHorizontal } from '@/components/icons/RectangleHorizontal'
import { RectangleVertical } from '@/components/icons/RectangleVertical'
import { Button, IconButton } from '@/components/ui/Button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select'
import { SliderWithInput } from '@/components/ui/SliderWithInput'
import { TextareaAutosize } from '@/components/ui/TextareaAutosize'
import { TextField } from '@/components/ui/TextField'
import { twx } from '@/lib/utils'
import Models from './models.json'

import type { ThreadActions } from '@/lib/api'

const modelData = Models.map((model) => {
  return {
    ...model,
    inputs: {
      loras: false,
      negativePrompt: false,
      maxQuantity: 4,
      dimensions: {
        portrait: { width: 832, height: 1216 },
        square: { width: 1024, height: 1024 },
        landscape: { width: 1216, height: 832 },
      },
      ...model.inputs,
    },
  }
})

const Label = twx(LabelPrimitive)`text-sm font-medium block`

const Lora = ({
  value,
  onValueChange,
  onRemove = () => {},
}: {
  value: { id: string; path: string; scale: number }
  onValueChange: (value: { id: string; path: string; scale: number }) => void
  onRemove?: () => void
}) => {
  const [path, setPath] = useState(value.path)
  const [scale, setScale] = useState(value.scale)

  return (
    <div className="flex rounded border border-gray-4">
      <div className="grow space-y-2 p-2 pr-0">
        <Label className="text-sm font-medium">
          Path
          <TextField
            value={path}
            onValueChange={(v) => {
              setPath(v)
              onValueChange({ id: value.id, path: v, scale: value.scale })
            }}
          />
        </Label>
        <Label>
          Scale
          <SliderWithInput
            label="Scale"
            min={0}
            max={1}
            step={0.01}
            value={scale}
            onValueChange={(v) => {
              setScale(v)
              onValueChange({ id: value.id, path: value.path, scale: v })
            }}
          />
        </Label>
      </div>

      <div className="flex-col-center shrink-0 p-1">
        <IconButton variant="ghost" aria-label="Remove" className="" onClick={onRemove}>
          <Icons.X size={18} />
        </IconButton>
      </div>
    </div>
  )
}

export const GenerationForm = (props: { onRun?: ThreadActions['run']; loading?: boolean }) => {
  const [modelId, setModelId] = useState(modelData[0]?.model_id ?? '')
  const model = modelData.find((model) => model.model_id === modelId)

  const [loras, setLoras] = useState<{ id: string; path: string; scale: number }[]>([])

  const [prompt, setPrompt] = useState('')
  const [negativePrompt, setNegativePrompt] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [seed, setSeed] = useState<number | undefined>(undefined)
  const [dimensions, setDimensions] = useState('square')

  const [inputsContainer] = useAutoAnimate()
  const [lorasContainer] = useAutoAnimate()

  const run = () => {
    if (!props.onRun) {
      console.error('No run function provided')
      return
    }

    props.onRun({
      runConfig: {
        type: 'textToImage' as const,
        resourceKey: `fal::${modelId}`,
        loras: loras.map((lora) => ({
          path: lora.path,
          scale: lora.scale,
        })),
        prompt,
        negativePrompt,
        n: quantity,
        seed,
        size: dimensions as 'portrait' | 'square' | 'landscape',
      },
    })
  }

  return (
    <div className="space-y-4 py-2">
      <div ref={inputsContainer} className="space-y-3 px-2">
        <Label>
          Model
          <Select value={modelId} onValueChange={setModelId}>
            <SelectTrigger className="items-start [&_[data-description]]:hidden">
              <SelectValue placeholder="Model" />
            </SelectTrigger>
            <SelectContent className="max-w-[96vw]">
              {Models.map((model) => (
                <SelectItem key={model.model_id} value={model.model_id}>
                  <p className="font-medium">{model.name}</p>
                  <p className="truncate text-sm text-gray-11" data-description>
                    {model.description}
                  </p>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Label>

        {model?.inputs.loras && (
          <div className="space-y-2 text-sm font-medium">
            <div className="flex-between">
              LoRAs
              <Button
                variant="surface"
                size="1"
                onClick={() => setLoras((prev) => [...prev, { id: nanoid(), path: '', scale: 1 }])}
                className="-mb-1"
              >
                Add
              </Button>
            </div>
            <div ref={lorasContainer} className="space-y-2">
              {loras.map((lora) => (
                <Lora
                  key={lora.id}
                  value={lora}
                  onValueChange={(v) => {
                    setLoras((prev) => prev.map((lora) => (lora.id === v.id ? v : lora)))
                  }}
                  onRemove={() => setLoras((prev) => prev.filter(({ id }) => id !== lora.id))}
                />
              ))}
            </div>
          </div>
        )}

        <Label>
          Prompt
          <TextareaAutosize value={prompt} onValueChange={setPrompt} />
        </Label>

        {model?.inputs.negativePrompt && (
          <Label>
            Negative Prompt
            <TextareaAutosize value={negativePrompt} onValueChange={setNegativePrompt} />
          </Label>
        )}

        <div>
          <Label>Dimensions</Label>
          <RadioCards.Root columns="3" gap="2" value={dimensions} onValueChange={setDimensions}>
            <RadioCards.Item
              value="portrait"
              className="flex-col gap-1"
              disabled={!model?.inputs.dimensions.portrait}
            >
              <RectangleVertical className="text-gray-11" />
              <p>Portrait</p>
              <p className="text-xs text-gray-11">832x1216</p>
            </RadioCards.Item>
            <RadioCards.Item
              value="square"
              className="flex-col gap-1"
              disabled={!model?.inputs.dimensions.square}
            >
              <Icons.Square size={24} className="text-gray-11" />
              <p>Square</p>
              <p className="text-xs text-gray-11">1024x1024</p>
            </RadioCards.Item>
            <RadioCards.Item
              value="landscape"
              className="flex-col gap-1"
              disabled={!model?.inputs.dimensions.landscape}
            >
              <RectangleHorizontal className="text-gray-11" />
              <p>Landscape</p>
              <p className="text-xs text-gray-11">1216x832</p>
            </RadioCards.Item>
          </RadioCards.Root>
        </div>

        <div className="flex-between">
          <Label htmlFor="quantity">Quantity</Label>
          <TextField
            id="quantity"
            type="number"
            className="w-16"
            min={1}
            max={model?.inputs.maxQuantity ?? 4}
            value={Math.min(quantity, model?.inputs.maxQuantity ?? 4)}
            onValueChange={(value) => setQuantity(Number(value))}
          />
        </div>

        <div className="flex-between">
          <Label htmlFor="seed">Seed</Label>
          <TextField
            id="seed"
            type="number"
            value={seed}
            onValueChange={(value) => setSeed(Number(value))}
            placeholder="random"
          />
        </div>
      </div>

      <div className="flex justify-end px-2">
        <Button variant="surface" loading={props.loading} onClick={run} disabled={!props.onRun}>
          Run
        </Button>
      </div>
    </div>
  )
}
