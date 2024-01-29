import { Button } from '@radix-ui/themes'
import { useAtom } from 'jotai'
import { getToggleAtom } from '../atoms'

type ToggleButtonProps = {
  name: string
  trueChildren?: React.ReactNode
  falseChildren?: React.ReactNode
  trueProps?: React.ComponentProps<typeof Button>
  falseProps?: React.ComponentProps<typeof Button>
  initialValue?: boolean
} & React.ComponentProps<typeof Button>

export const ToggleButton = ({
  name,
  trueChildren,
  falseChildren,
  trueProps,
  falseProps,
  initialValue,
  ...props
}: ToggleButtonProps) => {
  const [value, toggle] = useAtom(getToggleAtom(name, initialValue))
  const stateProps = value && trueProps ? trueProps : !value && falseProps ? falseProps : undefined

  const children = (value ? trueChildren : falseChildren) ?? name
  return (
    <Button variant="surface" onClick={() => toggle()} {...stateProps} {...props}>
      {children}
    </Button>
  )
}
