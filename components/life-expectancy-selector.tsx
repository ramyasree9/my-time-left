"use client"

import { Slider } from "@/components/ui/slider"

interface LifeExpectancySelectorProps {
  value: number
  onChange: (value: number) => void
}

export function LifeExpectancySelector({ value, onChange }: LifeExpectancySelectorProps) {
  const handleChange = (newValue: number[]) => {
    onChange(newValue[0])
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <span className="text-slate-300 text-sm">50 years</span>
        <span className="text-slate-300 text-sm font-medium">{value} years</span>
        <span className="text-slate-300 text-sm">120 years</span>
      </div>
      <Slider
        defaultValue={[value]}
        min={50}
        max={120}
        step={1}
        onValueChange={handleChange}
        className="cursor-pointer"
      />
    </div>
  )
}

