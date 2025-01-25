import * as Slider from '@radix-ui/react-slider'
import { useState, useCallback, useRef } from 'react'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { ActionPopover, PopoverHeader, PopoverContent, ActionPopoverRef } from './ActionPopover'

interface DomainSliderProps {
  trigger: React.ReactNode
  onValueChange?: (value: number) => void
  onDomainSelect?: (domain: number) => void
  onOpen?: () => void
  onClose?: () => void
}

const SLIDER_MARKS = [
  { value: 1, label: 'Journalistic' },
  { value: 2, label: 'Creative' },
  { value: 3, label: 'Business' },
  { value: 4, label: 'General' },
  { value: 5, label: 'Academic' },
  { value: 6, label: 'Technical' },
  { value: 7, label: 'Legal' },
]

export const DomainSlider = ({ trigger, onValueChange, onDomainSelect, onOpen, onClose }: DomainSliderProps) => {
  const [value, setValue] = useState([4]) // Default to General Writing
  const popoverRef = useRef<ActionPopoverRef>(null)

  const resetValue = useCallback(() => {
    setValue([4]) // Reset to General Writing
    onValueChange?.(4)
  }, [onValueChange])

  const handleValueChange = useCallback(
    (newValue: number[]) => {
      setValue(newValue)
      onValueChange?.(newValue[0])
    },
    [onValueChange],
  )

  const handleConfirm = useCallback(() => {
    onDomainSelect?.(value[0])
    popoverRef.current?.close()
  }, [value, onDomainSelect])

  const handleOpen = useCallback(() => {
    resetValue()
    onOpen?.()
  }, [onOpen, resetValue])

  const getCurrentMark = (value: number) => {
    return SLIDER_MARKS.find(mark => mark.value === value)
  }

  return (
    <ActionPopover ref={popoverRef} id="domain" trigger={trigger} onOpen={handleOpen} onClose={onClose}>
      <PopoverContent>
        <PopoverHeader title="Writing Domain">
          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="text-sm text-neutral-500 dark:text-neutral-400">{getCurrentMark(value[0])?.label}</div>
            </div>
            <Button
              variant="ghost"
              buttonSize="icon"
              className={cn(
                'relative h-7 w-7 transition-colors rounded-full',
                'text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:text-emerald-300 dark:hover:bg-emerald-950 before:absolute before:inset-0 before:rounded-full before:border-2 before:border-t-emerald-500 before:border-r-emerald-500 before:border-b-transparent before:border-l-transparent dark:before:border-t-emerald-400 dark:before:border-r-emerald-400 before:animate-[spin_1s_linear_infinite]',
              )}
              onClick={handleConfirm}
            >
              <Check className="h-4 w-4 relative" />
            </Button>
          </div>
        </PopoverHeader>
        <div className="w-[95%]">
          <Slider.Root
            className="relative flex items-center select-none touch-none w-full h-5"
            value={value}
            onValueChange={handleValueChange}
            max={7}
            min={1}
            step={1}
          >
            <Slider.Track className="relative grow h-[3px] bg-transparent">
              <div className="absolute inset-0 flex items-center justify-between px-[10px]">
                {SLIDER_MARKS.map(mark => (
                  <div key={mark.value} className="w-1.5 h-1.5 rounded-full bg-neutral-300 dark:bg-neutral-600" />
                ))}
              </div>
            </Slider.Track>
            <Slider.Thumb className="block w-5 h-5 bg-white dark:bg-neutral-800 border-2 border-emerald-500 hover:border-emerald-600 dark:border-emerald-400 dark:hover:border-emerald-300 rounded-full focus:outline-none" />
          </Slider.Root>
          <div className="flex justify-between text-xs text-neutral-500 dark:text-neutral-400 mt-4 px-[10px]">
            <span>Professional</span>
            <span>General</span>
            <span>Specialized</span>
          </div>
        </div>
      </PopoverContent>
    </ActionPopover>
  )
}