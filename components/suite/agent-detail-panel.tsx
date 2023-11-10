import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Image from 'next/image'
import { useRef } from 'react'
import { toast } from 'sonner'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Loading } from '../ui/loading'
import { getSuiteUser, renameAgent } from './actions'
import { EnginesCombobox } from './engines-combobox'

export function AgentDetailPanel({
  agentId,
  className,
}: { agentId: string } & React.ComponentProps<'div'>) {
  const {
    data: user,
    isPending,
    error,
  } = useQuery({ queryKey: ['suiteUser'], queryFn: () => getSuiteUser() })

  if (error) {
    toast.error(error.message)
  }

  const queryClient = useQueryClient()

  const mutRename = useMutation({
    mutationKey: ['renameAgent'],
    mutationFn: (name: string) => renameAgent(agent?.id ?? '', name),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['suiteUser'] }),
    onError(error, variables, context) {
      toast.error(error.message)
    },
  })

  const workbench = user ? user.workbench : undefined

  const activeTab = workbench
    ? workbench.tabs.find((tab) => tab.id === workbench.active)
    : undefined
  const agent = activeTab && user ? user.agents.find((a) => a.id === activeTab.agentId) : undefined

  return (
    <div className={cn('', className)}>
      {agent ? (
        <div className="grid grid-cols-[1fr_auto] rounded-md border">
          <div className="space-y-4 p-6">
            {isPending && <Loading />}
            <div className="space-x-4">
              {/* title / buttons */}
              <h3 className="inline text-lg font-semibold leading-none">{agent.name}</h3>
              <RenameDialog current={agent.name} onSubmit={mutRename.mutate}>
                <Button variant="outline" size="sm" disabled={mutRename.isPending}>
                  {mutRename.isPending && <Loading size="xs" />}
                  Rename
                </Button>
              </RenameDialog>
              <Button variant="default" size="sm" disabled>
                Deploy
              </Button>
              <Button variant="outline" size="sm" disabled>
                Edit
              </Button>
              <Button variant="destructive" size="sm" disabled>
                Delete
              </Button>
            </div>
            {/* debug info */}
            <div className="font-mono text-xs">
              <p className="">
                <span className="">ID: {agent.id} </span>
                <span className="">Created: {agent.createdAt.toISOString()} </span>
                <span className="">Updated: {agent.updatedAt.toISOString()} </span>
              </p>
              <p>
                <span className="">active: {agent.engineId} </span>
              </p>
            </div>
            {/* EngineCard */}
            <div className="space-x-2">
              <EnginesCombobox current={agent.engineId} />
            </div>
          </div>

          {/* avatar */}
          <div className="">
            <Image src={`/${agent.image}`} alt="agent avatar" width={200} height={200} />
          </div>
        </div>
      ) : null}
    </div>
  )
}

export function RenameDialog({
  children,
  current,
  onSubmit,
}: {
  children: React.ReactNode
  current: string
  onSubmit: (value: string) => unknown
}) {
  const ref = useRef<HTMLInputElement | null>(null)

  const submit = () => {
    const value = ref.current?.value
    if (!value) {
      console.log('no value')
      return
    }
    onSubmit(value)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rename Agent</DialogTitle>
          {/* <DialogDescription>Rename Agent</DialogDescription> */}
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="agent-name" className="sr-only">
              Name
            </Label>
            <Input ref={ref} id="agent-name" defaultValue={current} />
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary" onClick={submit}>
              Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
