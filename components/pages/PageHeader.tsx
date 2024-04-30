import { SignInButton, UserButton } from '@clerk/nextjs'
import { IconButton } from '@radix-ui/themes'
import { Authenticated, Unauthenticated } from 'convex/react'
import { HomeIcon, ImagesIcon, UserIcon } from 'lucide-react'
import NextImage from 'next/image'
import Link from 'next/link'

import LogoSunset from '@/assets/logo-sunset.svg'
import { useTitle } from '@/lib/hooks'

export const PageHeader = ({ icon, title }: { icon?: React.ReactNode; title?: string }) => {
  useTitle(title)

  return (
    <header className="h-12 gap-2 border-b px-1 flex-between">
      {/* logo / page titles */}
      <Link href="/" className="gap-1 flex-start">
        <div className="gap-1 flex-start">
          <NextImage src={LogoSunset} alt="" className="size-7 shrink-0" priority />
          <h1 className="text-lg font-semibold tracking-tight">e/suite</h1>
        </div>

        <h2 className="gap-2 font-mono tracking-tight flex-start">
          /{icon}
          {title}
        </h2>
      </Link>

      <div className="gap-2 flex-end">
        {/* quick nav */}
        <Authenticated>
          <IconButton variant="ghost" asChild>
            <Link href="/">
              <HomeIcon className="stroke-[1.5]" />
            </Link>
          </IconButton>

          <IconButton variant="ghost" asChild>
            <Link href="/image-feed">
              <ImagesIcon className="stroke-[1.5]" />
            </Link>
          </IconButton>
        </Authenticated>

        {/* user buttons */}
        <Unauthenticated>
          <SignInButton>
            <IconButton variant="surface" radius="large">
              <UserIcon className="stroke-[1.5]" />
            </IconButton>
          </SignInButton>
        </Unauthenticated>

        <UserButton />
      </div>
    </header>
  )
}
