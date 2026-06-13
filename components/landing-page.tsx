"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/date-picker"
import { LifeExpectancySelector } from "@/components/life-expectancy-selector"
import { SandTimer } from "@/components/sand-timer"
import { calculateLifeData } from "@/lib/calculate-life-data"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

const STORAGE_KEY = "mtl:last-input"

export function LandingPage() {
  const [birthDate, setBirthDate] = useState<Date | undefined>(new Date(1995, 0, 1))
  const [lifeExpectancy, setLifeExpectancy] = useState<number>(80)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Restore the last input so returning visitors pick up where they left off.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const saved = JSON.parse(raw) as { dob?: string; expectancy?: number }
        if (saved.dob) {
          const d = new Date(saved.dob)
          if (!isNaN(d.getTime())) setBirthDate(d)
        }
        if (typeof saved.expectancy === "number") setLifeExpectancy(saved.expectancy)
      }
    } catch {
      /* ignore malformed storage */
    }
  }, [])

  // Live preview: drives the ambient hourglass behind the form.
  const previewPct = useMemo(() => {
    if (!birthDate || birthDate > new Date()) return 0
    return calculateLifeData(birthDate, lifeExpectancy).percentageLived
  }, [birthDate, lifeExpectancy])

  const handleSubmit = () => {
    if (!birthDate) {
      setError("Please select your date of birth")
      return
    }
    if (birthDate > new Date()) {
      setError("Date of birth cannot be in the future")
      return
    }
    setError(null)

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ dob: birthDate.toISOString(), expectancy: lifeExpectancy }),
      )
    } catch {
      /* ignore */
    }

    const params = new URLSearchParams()
    params.set("dob", birthDate.toISOString())
    params.set("expectancy", lifeExpectancy.toString())
    router.push(`/visualization?${params.toString()}`)
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#070a12] text-white">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-amber-500/10 blur-[120px]" />
        <div className="absolute bottom-0 left-1/4 h-[28rem] w-[28rem] rounded-full bg-indigo-600/10 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center gap-12 px-6 py-16 lg:flex-row lg:gap-20">
        {/* Left: message + ambient hourglass */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-1 flex-col items-center text-center lg:items-start lg:text-left"
        >
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.35em] text-amber-300/70">
            Memento Mori
          </p>
          <h1 className="text-balance text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            Your time is
            <br />
            <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-orange-400 bg-clip-text text-transparent">
              running.
            </span>
          </h1>
          <p className="mt-6 max-w-md text-pretty text-lg text-slate-300/90">
            Every life is a finite number of days. See exactly how many you&apos;ve spent — and how
            many likely remain.
          </p>

          <div className="mt-10 lg:hidden">
            <SandTimer percentageLived={previewPct} size={180} />
          </div>
        </motion.div>

        {/* Right: form */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
          className="flex flex-1 flex-col items-center gap-8"
        >
          <div className="hidden lg:block">
            <SandTimer percentageLived={previewPct} size={220} />
          </div>

          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">When were you born?</label>
                <DatePicker date={birthDate} setDate={setBirthDate} />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-slate-300">
                  How long do you expect to live?
                </label>
                <LifeExpectancySelector value={lifeExpectancy} onChange={setLifeExpectancy} />
              </div>

              {error && <p className="text-sm font-medium text-rose-400">{error}</p>}

              <Button
                onClick={handleSubmit}
                className="group w-full bg-gradient-to-r from-amber-400 to-orange-500 font-semibold text-black hover:from-amber-300 hover:to-orange-400"
              >
                See my time
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </div>
          </div>

          <p className="max-w-sm text-center text-xs leading-relaxed text-slate-500">
            Not meant to be morbid — a gentle nudge toward spending your days on what matters.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
