"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/date-picker"
import { LifeExpectancySelector } from "@/components/life-expectancy-selector"

interface SettingsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialDob: Date
  initialExpectancy: number
  onApply: (dob: Date, expectancy: number) => void
}

export function SettingsDialog({
  open,
  onOpenChange,
  initialDob,
  initialExpectancy,
  onApply,
}: SettingsDialogProps) {
  const [dob, setDob] = useState<Date | undefined>(initialDob)
  const [expectancy, setExpectancy] = useState(initialExpectancy)
  const [error, setError] = useState<string | null>(null)

  // Reset draft to current values whenever the dialog opens.
  useEffect(() => {
    if (open) {
      setDob(initialDob)
      setExpectancy(initialExpectancy)
      setError(null)
    }
  }, [open, initialDob, initialExpectancy])

  const apply = () => {
    if (!dob) return setError("Please pick a date of birth")
    if (dob > new Date()) return setError("Date of birth can't be in the future")
    onApply(dob, expectancy)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-slate-800 bg-[#0b0f17] text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit your details</DialogTitle>
          <DialogDescription className="text-slate-400">
            Update your birth date or life expectancy to recalculate everything.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Date of birth</label>
            <DatePicker date={dob} setDate={setDob} />
          </div>
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-300">Life expectancy</label>
            <LifeExpectancySelector value={expectancy} onChange={setExpectancy} />
          </div>
          {error && <p className="text-sm font-medium text-rose-400">{error}</p>}
        </div>

        <DialogFooter>
          <Button
            onClick={apply}
            className="w-full bg-gradient-to-r from-amber-400 to-orange-500 font-semibold text-black hover:from-amber-300 hover:to-orange-400"
          >
            Update
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
