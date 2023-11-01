import { cn } from '@/lib/utils'
import { Engine } from '@prisma/client'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'

export function EngineInfo({
  engine,
  children,
  className,
}: {
  engine: Engine
  children?: React.ReactNode
} & React.ComponentProps<'div'>) {
  return (
    <>
      <div className={cn('mx-auto max-w-xl', className)}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead colSpan={2} className="w-full text-center">
                Specifications
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>creator:</TableCell>
              <TableCell>{engine?.creatorName}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>model:</TableCell>
              <TableCell>{engine?.model}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>context length:</TableCell>
              <TableCell>{engine?.contextLength}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>licence:</TableCell>
              <TableCell>{engine?.license}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>platform:</TableCell>
              <TableCell>{engine?.hostId}</TableCell>
            </TableRow>
          </TableBody>
          <TableHeader>
            <TableRow>
              <TableHead colSpan={2} className="w-full text-center">
                Description
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell colSpan={2}>{engine?.description}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        {children}
      </div>
    </>
  )
}
