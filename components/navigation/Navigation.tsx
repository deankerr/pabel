'use client'

import * as Icons from '@phosphor-icons/react/dist/ssr'
import { Authenticated } from 'convex/react'
import { useAtom } from 'jotai'
import Link from 'next/link'

import { sidebarOpenAtom } from '@/components/layout/atoms'
import { SidebarButton } from '@/components/layout/SidebarButton'
import { UserButtons } from '@/components/layout/UserButtons'
import { NavGroup } from '@/components/navigation/NavGroup'
import { NavLink } from '@/components/navigation/NavLink'
import { AppTitle } from '@/components/ui/AppTitle'
import { AdminOnlyUi } from '@/components/util/AdminOnlyUi'
import { appConfig } from '@/config/config'
import { useThreads } from '@/lib/api'
import { useSuitePath } from '@/lib/helpers'
import { cn } from '@/lib/utils'

export const Navigation = () => {
  const [isSidebarOpen, toggleSidebar] = useAtom(sidebarOpenAtom)
  const path = useSuitePath()
  const isBlankPage = !path.slug

  const { threadsList } = useThreads()
  const favorites = threadsList?.filter((thread) => thread.favorite && thread.userIsViewer) ?? []

  return (
    <>
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-10 bg-overlay md:hidden"
          onClick={() => toggleSidebar(false)}
        />
      )}

      <nav
        className={cn(
          'flex w-60 shrink-0 flex-col gap-1 overflow-hidden rounded-md border border-gray-5 bg-gray-1',
          'fixed left-1.5 top-1.5 z-10 h-[calc(100dvh-0.75rem)] transition-transform',
          isSidebarOpen || isBlankPage
            ? '-translate-x-0'
            : 'pointer-events-none -translate-x-[calc(100%+1.5rem)] md:pointer-events-auto md:-translate-x-0',
          'md:static md:z-auto',
        )}
      >
        {/* * logo / menu button * */}
        <div className="flex-between h-10 w-full shrink-0 px-3">
          <Link href={appConfig.baseUrl} aria-label="Go to home page">
            <AppTitle />
          </Link>

          <div className="flex-end gap-1">
            <SidebarButton />
          </div>
        </div>

        <Authenticated>
          <div className="px-1 py-1">
            <NavLink href={path.toThread('new')} aria-current={path.slug === 'new' && 'page'}>
              <Icons.NotePencil size={18} className="text-accentA-11" />
              New thread
            </NavLink>
          </div>
        </Authenticated>

        <NavGroup heading="Favorites" hidden={favorites.length === 0}>
          {favorites.map((thread) => (
            <NavLink
              key={thread._id}
              href={path.toThread(thread.slug)}
              aria-current={path.slug === thread.slug && 'page'}
            >
              <ThreadIcon type={thread.latestRunConfig?.type} />
              <div className="line-clamp-2 select-none">{thread.title ?? 'Untitled'}</div>
            </NavLink>
          ))}
        </NavGroup>

        <NavGroup heading="Threads" hidden={threadsList?.length === 0} scrollable>
          {threadsList
            ?.filter((thread) => !favorites.includes(thread) && thread.slug !== 'new')
            .map((thread) => (
              <NavLink
                key={thread._id}
                href={path.toThread(thread.slug)}
                aria-current={path.slug === thread.slug && 'page'}
              >
                <ThreadIcon type={thread.latestRunConfig?.type} />
                <div className="line-clamp-2 select-none">{thread.title ?? 'Untitled'}</div>
              </NavLink>
            ))}
        </NavGroup>

        <div className="grow" />
        {/* * footer * */}
        <div className="flex-center h-12 shrink-0 gap-2 border-t border-grayA-3 px-3">
          <UserButtons />
          <AdminOnlyUi>
            <Link href="/admin" className="text-xs text-gray-11 hover:text-gray-12">
              Admin
            </Link>
          </AdminOnlyUi>
        </div>
      </nav>
    </>
  )
}

const ThreadIcon = ({ type = '' }: { type?: string }) => {
  switch (type) {
    case 'chat':
      return <Icons.Chat size={18} className="text-accentA-11" />
    case 'textToImage':
      return <Icons.Images size={18} className="text-accentA-11" />
    default:
      return <Icons.NotePencil size={18} className="text-accentA-11" />
  }
}
