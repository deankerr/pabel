'use client'

import { cn } from '@/lib/utils'
import { User } from '@prisma/client'
import { ChatBubbleIcon } from '@radix-ui/react-icons'
import { useQuery } from '@tanstack/react-query'
import { Session } from 'next-auth'
import Link from 'next/link'
import { useState } from 'react'
import { MainStatusBar } from '../main-status-bar'
import { SignInOutButton } from '../sign-in-out-button'
import { ThemeToggle } from '../ui/theme-toggle'
import { getUser } from './actions'
import { AgentDetailPanel } from './agent-detail-panel'
import { AgentFeed } from './agent-feed'
import { AgentTabBar } from './agent-tab-bar'
import { InferenceBuffer } from './inference-buffer'
import { ParameterPanel } from './parameter-panel'
import { SuiteRailList } from './suite-rail-list'
import { SuiteTabBar } from './suite-tab-bar'

export function SuiteShell({ session }: { session: Session } & React.ComponentProps<'div'>) {
  const { data, error, isFetched } = useQuery({
    queryKey: ['user'],
    queryFn: () => getUser(session.user.id),
  })

  //& separate user / agents / workbench?

  //! currently tab = agentId
  const [activeTab, setActiveTab] = useState('')

  return (
    <div className="grid h-full grid-cols-[auto_1fr] grid-rows-[auto_2.75rem]">
      {/* SuiteRail */}
      <div className="flex flex-col border-r">
        <SuiteAppTitle className="h-12 border-b" />
        <SuiteRailList className="grow px-2 py-4" />
        <div className="flex justify-around px-2 py-4">
          <ThemeToggle />
          <SignInOutButton session={session} />
        </div>
      </div>

      {/* SuiteMain */}
      <div className="grid grid-rows-[auto_1fr] overflow-hidden">
        <div className="">
          <SuiteTabBar
            className="h-12"
            uid={session.user.id}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
          <AgentDetailPanel className="p-6" agentId={activeTab} />
          <AgentTabBar className="" />
        </div>

        <div className="grid grid-flow-col overflow-hidden">
          <InferenceBuffer agentId={activeTab} />
          <ParameterPanel className="border-l" />
        </div>
      </div>

      {/* SuiteStatus */}
      <MainStatusBar className="col-span-full col-start-1" session={session} />
    </div>
  )
}

function SuiteAppTitle({ className }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <Link
        className="inline-flex items-center justify-center gap-1.5 font-semibold tracking-tight"
        href="/"
      >
        <ChatBubbleIcon className="mb-0.5 h-5 w-5" />
        e/suite
      </Link>
    </div>
  )
}
