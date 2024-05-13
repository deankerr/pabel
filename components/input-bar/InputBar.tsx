'use client'

import { IconButton, SegmentedControl } from '@radix-ui/themes'
import { useMutation, useQuery } from 'convex/react'
import { SendHorizonalIcon } from 'lucide-react'
import TextareaAutosize from 'react-textarea-autosize'
import { toast } from 'sonner'

import { useInputBarAtom } from '@/components/input-bar/atoms'
import { useSendMessage } from '@/components/input-bar/useSendMessage'
import { Glass } from '@/components/ui/Glass'
import { SelectList } from '@/components/ui/SelectList'
import { api } from '@/convex/_generated/api'
import { useCurrentThreadId, useModelList } from '@/lib/api'
import { cn } from '@/lib/utils'

type InputBarProps = { props?: unknown }

export const InputBar = ({}: InputBarProps) => {
  const [inputBar, setInputBar] = useInputBarAtom()

  const chatModels = useQuery(api.models.listChatModels, {})
  const imageModels = useModelList()

  const sendMessage = useSendMessage()

  return (
    <div className="fixed bottom-0 left-1/2 flex w-full -translate-x-1/2 flex-col justify-center">
      <div className="mx-auto min-h-12 w-full max-w-3xl p-4">
        <Glass barWidth={1} borderRadius={18} className="absolute inset-0" />

        <div className="rounded-lg bg-gray-2 p-3">
          <div className="flex flex-col gap-3 text-lg">
            <div className="flex items-end gap-2">
              <TextareaAutosize
                maxRows={10}
                placeholder="A bird in the bush is worth..."
                className="w-full resize-none bg-transparent p-1 text-gray-12 outline-none placeholder:text-gray-9"
                value={inputBar.prompt}
                onChange={(e) => setInputBar((o) => ({ ...o, prompt: e.target.value }))}
              />
              <div className="h-9 flex-end">
                <IconButton variant="ghost" size="2" onClick={() => void sendMessage()}>
                  <SendHorizonalIcon />
                </IconButton>
              </div>
            </div>

            <div className="flex-wrap gap-2 flex-between">
              <SegmentedControl.Root
                value={inputBar.mode}
                onValueChange={(value) =>
                  setInputBar((o) => ({ ...o, mode: value as 'chat' | 'image' }))
                }
              >
                <SegmentedControl.Item value="chat">Chat</SegmentedControl.Item>
                <SegmentedControl.Item value="image">Image</SegmentedControl.Item>
              </SegmentedControl.Root>

              <div className={cn('hidden w-64', inputBar.mode === 'image' && 'block')}>
                {imageModels && (
                  <SelectList
                    items={imageModels.map(({ model_id, name }) => ({
                      value: model_id,
                      label: name,
                    }))}
                    value={inputBar.imageModel}
                    onValueChange={(value) => setInputBar((o) => ({ ...o, imageModel: value }))}
                  />
                )}
              </div>
              <div className={cn('hidden w-64', inputBar.mode === 'chat' && 'block')}>
                {chatModels && (
                  <SelectList
                    items={chatModels.map(({ model_id, name }) => ({
                      value: model_id,
                      label: name,
                    }))}
                    value={inputBar.chatModel}
                    onValueChange={(value) => setInputBar((o) => ({ ...o, chatModel: value }))}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
