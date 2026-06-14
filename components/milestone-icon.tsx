import { Armchair, Briefcase, Flag, GraduationCap, School, type LucideProps } from "lucide-react"

const MAP = {
  school: School,
  graduation: GraduationCap,
  briefcase: Briefcase,
  armchair: Armchair,
} as const

/** Resolve a milestone icon key to its lucide icon (falls back to a flag). */
export function MilestoneIcon({ icon, ...props }: { icon: string } & LucideProps) {
  const Icon = (MAP as Record<string, typeof Flag>)[icon] ?? Flag
  return <Icon {...props} />
}
