"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface VisualizationNavProps {
  activeType: string
  onChange: (type: any) => void
}

export function VisualizationNav({ activeType, onChange }: VisualizationNavProps) {
  return (
    <div className="flex justify-center mt-6">
      <Tabs value={activeType} onValueChange={onChange} className="w-full max-w-md">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="years">Years</TabsTrigger>
          <TabsTrigger value="months">Months</TabsTrigger>
          <TabsTrigger value="weeks">Weeks</TabsTrigger>
          <TabsTrigger value="days">Days</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  )
}

