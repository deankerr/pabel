import { atom, useAtom } from 'jotai'

export function createTextInputAtom(args: { label: string; name: string; initialValue: string }) {
  return { ...args, atom: atom(args.initialValue) }
}

export function createNumberInputAtom(args: {
  label: string
  name: string
  initialValue: number
  min: number
  max: number
  step: number
}) {
  return { ...args, atom: atom(args.initialValue) }
}

const chatListOpenAtom = atom(false)

export function useChatListOpenAtom() {
  const [isOpen, setIsOpen] = useAtom(chatListOpenAtom)

  const open = () => setIsOpen(true)
  const close = () => setIsOpen(false)
  const toggle = () => setIsOpen(!isOpen)

  return { isOpen, setIsOpen, open, close, toggle }
}
