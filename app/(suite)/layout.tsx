import { auth } from '@/auth'
import { BottomPanel } from '@/components/chat/bottom-panel'
import { ChatNav } from '@/components/chat/chat-nav'
import { MainHeader } from '@/components/main-header'
import { getUser } from '@/lib/db'

export default async function SuiteLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  const user = await getUser(session?.user.id)

  return (
    <div className="grid h-full grid-rows-[3rem_2.75rem_1fr_2.75rem]">
      <MainHeader className="" />
      <ChatNav user={user} />
      {children}
      <BottomPanel />
    </div>
  )
}
