'use client'

import { Switch } from '@/components/ui/switch'
import { PlatformKeys, schemas } from '@/lib/api/schemas'
import { cn } from '@/lib/utils'
import { Engine } from '@prisma/client'
import { ImmerHook, useImmer } from 'use-immer'
import { ChatSession, EngineInput } from '../types'
import { SliderInput } from './slider-input'
import { TagInput } from './tag-input'

const sliderInputData = {
  temperature: {
    min: 0,
    max: 2,
    step: 0.01,
    default: 1,
  },
  max_tokens: {
    min: 1,
    max: 4321,
    step: 1,
    default: 1234,
  },
  frequency_penalty: {
    min: -2,
    max: 2,
    step: 0.01,
    default: 0,
  },
  presence_penalty: {
    min: -2,
    max: 2,
    step: 0.01,
    default: 0,
  },
  repetition_penalty: {
    min: -2,
    max: 2,
    step: 0.01,
    default: 0,
  },
  top_p: {
    min: 0,
    max: 2,
    step: 0.01,
    default: 1,
  },
  top_k: {
    min: 0,
    max: 2,
    step: 0.01,
    default: 1,
  },
} as const
const sliderInputKeys = Object.keys(sliderInputData) as Array<keyof typeof sliderInputData>

// maximums
const tagInputData = {
  stop: 4,
  stop_token: 1,
}
const tagInputKeys = Object.keys(tagInputData) as Array<keyof typeof tagInputData>

const defaultInput: EngineInput = {
  fieldsEnabled: [],
  temperature: 1,
  max_tokens: 1234,
  frequency_penalty: 0,
  presence_penalty: 0,
  repetition_penalty: 0,
  top_p: 1,
  top_k: 1,
  stop: [],
  stop_token: [],
}

const temp_chatSession = {
  id: 'temp123' as const,
  name: 'Temp',
  engineId: 'temp-engine',
  engineInput: {} as Record<string, EngineInput>,
}

const labelClass = 'font-mono text-sm'

export function EngineInputControls({ className }: {} & React.ComponentProps<'div'>) {
  const [session, setSession] = useImmer(temp_chatSession)

  const engine = {
    id: 'temp-engine-id',
    providerId: 'openai',
  }

  const inputs: EngineInput = {
    ...defaultInput,
    ...session.engineInput[engine.id],
  }
  const inputKeys = Object.keys(inputs)

  const schemaKeys = schemas[engine.providerId as PlatformKeys].chat.input.keyof()
    .options as string[]

  const setInput = <T extends keyof EngineInput>(key: T, value: EngineInput[T]) => {
    setSession((s) => {
      s.engineInput[engine.id] = {
        ...inputs,
        [key]: value,
        fieldsEnabled: [...inputs.fieldsEnabled, key],
      }
    })
  }

  const setFieldEnabled = (key: keyof EngineInput, enabled: boolean) => {
    setSession((s) => {
      s.engineInput[engine.id] = {
        ...inputs,
        fieldsEnabled: enabled
          ? [...inputs.fieldsEnabled, key]
          : inputs.fieldsEnabled.filter((k) => k !== key),
      }
    })
  }

  return (
    <div className={cn('space-y-8', className)}>
      {sliderInputKeys.map((key) => {
        if (inputKeys.includes(key) && schemaKeys.includes(key)) {
          return (
            <div key={key}>
              <div className={labelClass}>
                <Switch
                  checked={inputs.fieldsEnabled.includes(key)}
                  onCheckedChange={(value) => setFieldEnabled(key, value)}
                />{' '}
                {key}
              </div>
              <SliderInput
                value={inputs[key]}
                onChange={(value) => setInput(key, value)}
                range={sliderInputData[key]}
              />
            </div>
          )
        }
      })}

      {tagInputKeys.map((key) => {
        if (inputKeys.includes(key) && schemaKeys.includes(key)) {
          return (
            <div key={key} className="grid grid-cols-[auto_1fr] items-center gap-x-2">
              <div className={labelClass}>
                <Switch
                  checked={inputs.fieldsEnabled.includes(key)}
                  onCheckedChange={(value) => setFieldEnabled(key, value)}
                />{' '}
                {key}
              </div>
              <TagInput values={inputs[key]} onChange={(value) => setInput(key, value)} />
            </div>
          )
        }
      })}
    </div>
  )
}
