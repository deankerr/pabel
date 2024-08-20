'use client'

import { useWindowSize } from '@react-hookz/web'

import { ClientOnly } from '@/components/util/ClientOnly'
import { cn } from '@/lib/utils'

export function TailwindBreakpointIndicator() {
  const { width, height } = useWindowSize()
  if (process.env.NODE_ENV !== 'development') return null
  const content =
    "before:content-['xs'] sm:before:content-['sm'] md:before:content-['md'] lg:before:content-['lg'] xl:before:content-['xl'] 2xl:before:content-['2xl']"
  const dimensions = width && height ? `⋅${width}x${height}` : null

  return (
    <ClientOnly>
      <div
        suppressHydrationWarning
        className={cn(
          'fixed left-0 top-0 z-[99999] bg-[#111111] text-[0.5rem] text-[#BBBBBB]',
          content,
        )}
      >
        <span>{dimensions}</span>
      </div>
    </ClientOnly>
  )
}
