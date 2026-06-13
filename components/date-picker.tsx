"use client"

import * as React from "react"
import { format, getYear } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DatePickerProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
}

export function DatePicker({ date, setDate }: DatePickerProps) {
  // Default to 1995 if no date is selected
  const defaultYear = 1995
  const [calendarOpen, setCalendarOpen] = React.useState(false)
  const [calendarMonth, setCalendarMonth] = React.useState<Date | undefined>(date || new Date(defaultYear, 0, 1))

  // Get the current year from the selected date or use default
  const selectedYear = date ? getYear(date) : defaultYear

  // Generate years from 1920 to current year
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: currentYear - 1919 }, (_, i) => 1920 + i)

  // Handle year selection within the calendar
  const handleYearChange = (year: string) => {
    const yearNum = Number.parseInt(year, 10)

    // Update the calendar view to show the selected year
    if (calendarMonth) {
      const newCalendarMonth = new Date(calendarMonth)
      newCalendarMonth.setFullYear(yearNum)
      setCalendarMonth(newCalendarMonth)
    } else {
      setCalendarMonth(new Date(yearNum, 0, 1))
    }

    if (date) {
      // Update existing date with new year
      const newDate = new Date(date)
      newDate.setFullYear(yearNum)
      setDate(newDate)
    } else {
      // Create new date with selected year and today's month/day
      const today = new Date()
      const newDate = new Date(yearNum, today.getMonth(), today.getDate())
      setDate(newDate)
    }
  }

  // Handle date selection
  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate)
    // Close the calendar after selection
    setCalendarOpen(false)
  }

  // When date changes, update the calendar month view
  React.useEffect(() => {
    if (date) {
      setCalendarMonth(date)
    }
  }, [date])

  return (
    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start" side="bottom">
        <div className="p-3 border-b border-border">
          <Select value={selectedYear.toString()} onValueChange={handleYearChange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Year" />
            </SelectTrigger>
            <SelectContent className="max-h-[200px]" position="popper">
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          month={calendarMonth}
          onMonthChange={setCalendarMonth}
          initialFocus
          disabled={(date) => date > new Date()}
        />
      </PopoverContent>
    </Popover>
  )
}

