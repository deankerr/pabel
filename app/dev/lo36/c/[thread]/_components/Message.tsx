import { useState } from 'react'
import * as Icons from '@phosphor-icons/react/dist/ssr'
import { DropdownMenu, IconButton } from '@radix-ui/themes'

import { Marble } from '@/app/dev/lo36/c/[thread]/_components/Marble'
import AudioPlayer from '@/components/audio/AudioPlayer'
import { ImageCard } from '@/components/images/ImageCard'
import { Markdown } from '@/components/message/Markdown'
import { cn, getInferenceConfig } from '@/lib/utils'

import type { EMessage } from '@/convex/types'

export const Message = ({
  message,
  removeMessage,
  className,
  ...props
}: {
  message: EMessage
  removeMessage?: (args: { messageId: string }) => void
} & React.ComponentProps<'div'>) => {
  const { textToImageConfig } = getInferenceConfig(message.inference)

  const name = getMessageName(message)
  const text = textToImageConfig ? textToImageConfig.prompt : message.text
  // const isShortMessage = text !== undefined && text.length < 500

  const [messageTime] = useState(new Date(message._creationTime).toTimeString().slice(0, 5))

  const shouldAddSpacer = message.images.length > 0 || message.audio.length > 0
  return (
    <div
      {...props}
      className={cn(
        'grid shrink-0 grid-cols-[minmax(72px,_1fr)_minmax(0,_768px)_minmax(48px,_1fr)]',
        'rounded-md border border-transparent hover:border-gray-5',
        'box-content min-h-7 text-sm',
        shouldAddSpacer && 'mb-2',
        className,
      )}
    >
      {/* # left gutter # */}
      <div className="pl-1">
        <div className="flex min-h-7 items-center gap-1.5">
          {/* * time * */}
          <div className="shrink-0 text-gray-10" style={{ fontVariantNumeric: 'tabular-nums' }}>
            {messageTime ?? '00:00'}
          </div>

          {/* * marble * */}
          <Marble name={name} size={15} className={cn('flex overflow-hidden')} />
        </div>
      </div>

      {/* # name / text content # */}
      <div className="py-1">
        {/* * name * */}
        <span className={cn('shrink-0 font-medium text-brown-11')}>{name}</span>{' '}
        {text && text.length > 300 ? <Markdown text={text} /> : text}
        {/* * basic error display * */}
        {message.jobs
          .flatMap((job) => job.errors)
          .map(
            (error, i) =>
              error && (
                <div
                  key={i}
                  className="rounded-lg border border-red-10 px-2 py-1 text-xs text-red-11"
                >
                  {error.code} {error.message}
                </div>
              ),
          )}
      </div>

      {/* # right gutter # */}
      <div className="text-right">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <IconButton variant="ghost" size="1" color="gray" className="m-0 size-7 p-0">
              <Icons.DotsThree size={24} />
            </IconButton>
          </DropdownMenu.Trigger>

          <DropdownMenu.Content variant="soft" align="end">
            {/* <DropdownMenu.Item onClick={() => setEditing(!editing)}>
                    {editing ? 'Cancel Edit' : 'Edit'}
                  </DropdownMenu.Item>

                  <DropdownMenu.Item onClick={() => setShowJson(!showJson)}>
                    Show JSON
                  </DropdownMenu.Item> */}

            <DropdownMenu.Item
              color="red"
              disabled={!removeMessage}
              onClick={() => removeMessage?.({ messageId: message._id })}
            >
              Delete
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>

      {/* # images # */}
      {message.images.length > 0 ? (
        <>
          <div></div>
          <div className="flex flex-wrap justify-center gap-2 py-1">
            {message.images.map((image) => (
              <div className="w-full max-w-[45%]" key={image._id}>
                <ImageCard image={image} />
              </div>
            ))}
          </div>
          <div></div>
        </>
      ) : null}

      {/* # audio # */}
      {message.audio.length > 0 ? (
        <div className="col-start-2 space-y-1 rounded-lg bg-grayA-2 p-3 sm:w-fit">
          {message.audio.map((sfx) =>
            sfx.fileUrl ? (
              <AudioPlayer key={sfx._id} url={sfx.fileUrl} titleText={sfx.generationData.prompt} />
            ) : null,
          )}
        </div>
      ) : null}
    </div>
  )
}

function getMessageName(message: EMessage) {
  const { textToImageConfig, textToAudioConfig } = getInferenceConfig(message.inference)
  if (textToAudioConfig) return 'elevenlabs sound generation'
  if (textToImageConfig) return textToImageConfig.endpointModelId
  if (message.name) return message.name
  if (message.role === 'user') return 'You'
  return 'Assistant'
}