import { Input } from '@/components/ui/input'
import { Slider } from '@/components/ui/slider'

export function SliderInput({
  value,
  onChange,
  range,
}: {
  value: number
  onChange: (value: number) => void
  range: Record<'min' | 'max' | 'step' | 'default', number>
}) {
  return (
    <div className="flex w-full space-x-1">
      <Slider
        {...range}
        value={[value ?? 0]}
        onValueChange={([newValue]) => {
          onChange(newValue ?? range.default)
        }}
      />
      <Input
        {...range}
        className="w-20 px-1 text-right font-mono"
        type="number"
        value={value}
        onChange={(e) => {
          onChange(Number(e.target.value))
        }}
      />
    </div>
  )
}
