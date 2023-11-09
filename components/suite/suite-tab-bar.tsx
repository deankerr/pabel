import { cn } from '@/lib/utils'
import { Cross1Icon, DotFilledIcon, PlusIcon } from '@radix-ui/react-icons'
import { useQuery } from '@tanstack/react-query'
import { Button } from '../ui/button'
import { getSuiteUser } from './actions'

export function SuiteTabBar({
  activeTab,
  setActiveTab,
  className,
}: {
  activeTab: string
  setActiveTab: (id: string) => void
} & React.ComponentProps<'div'>) {
  const {
    data: user,
    isPending,
    error,
  } = useQuery({ queryKey: ['suiteUser'], queryFn: () => getSuiteUser() })

  return (
    <div className={cn('flex items-center overflow-x-auto bg-muted/50', className)}>
      {user
        ? user?.agents.map((a) => (
            <Tab
              key={a.id}
              title={a.name}
              isActive={a.id === activeTab}
              onClick={() => setActiveTab(a.id)}
            />
          ))
        : null}

      <Button variant="ghost" className="h-full rounded-none px-1 hover:text-primary">
        <PlusIcon width={20} height={20} />
      </Button>
    </div>
  )
}

function Tab({
  title,
  isActive,
  onClick,
}: { title: string; isActive: boolean } & React.ComponentProps<'div'>) {
  return (
    <div
      // key={t.id}
      className={cn(
        'group flex h-full w-full max-w-[12rem] cursor-pointer items-center border-t-primary bg-muted text-sm font-medium',
        isActive ? 'border-t-2 bg-background' : 'opacity-50 hover:border-x hover:opacity-100',
      )}
      onClick={onClick}
    >
      {/* <CaretRightIcon width={20} height={20} className="inline-block" /> */}
      <div className="w-[26px]"></div>
      <div
        className="w-full text-center"
        onClick={(e) => {
          if (!isActive) return
        }}
      >
        <p className={isActive ? 'group-hover:underline' : ''}>{title}</p>
      </div>

      {/* dot / close button */}
      <div className="flex w-7 items-center">
        <Button variant="ghost" className="h-min w-min rounded-none p-0 hover:text-destructive">
          <DotFilledIcon className="group-hover:hidden" />
          <Cross1Icon width={16} height={16} className="hidden group-hover:inline-flex" />
        </Button>
      </div>
    </div>
  )
}
