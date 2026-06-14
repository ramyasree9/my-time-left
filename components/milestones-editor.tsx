"use client"

import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import type { Milestone } from "@/lib/types"
import { MilestoneIcon } from "@/components/milestone-icon"

interface MilestonesEditorProps {
  milestones: Milestone[]
  lifeExpectancy: number
  onChange: (milestones: Milestone[]) => void
}

/** Bare content (no Card) — rendered inside a dialog. */
export function MilestonesEditor({ milestones, lifeExpectancy, onChange }: MilestonesEditorProps) {
  const update = (id: string, patch: Partial<Milestone>) =>
    onChange(milestones.map((m) => (m.id === id ? { ...m, ...patch } : m)))

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {milestones.map((m) => (
        <div
          key={m.id}
          className="flex items-center justify-between gap-3 rounded-lg border border-white/[0.06] bg-white/[0.02] px-4 py-3"
        >
          <div className="flex items-center gap-2.5">
            <MilestoneIcon icon={m.icon} className="h-4 w-4 shrink-0" style={{ color: m.color }} />
            <span className={`text-sm font-medium ${m.enabled ? "text-white" : "text-slate-500"}`}>
              {m.label}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Input
                type="number"
                min={0}
                max={lifeExpectancy}
                value={m.age}
                onChange={(e) => {
                  const v = Number.parseInt(e.target.value, 10)
                  if (!Number.isNaN(v)) update(m.id, { age: Math.max(0, Math.min(lifeExpectancy, v)) })
                }}
                className="h-8 w-16 bg-transparent text-center text-sm"
              />
              <span className="text-xs text-slate-500">yrs</span>
            </div>
            <Switch checked={m.enabled} onCheckedChange={(checked) => update(m.id, { enabled: checked })} />
          </div>
        </div>
      ))}
    </div>
  )
}
