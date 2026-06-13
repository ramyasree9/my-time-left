"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DatePicker } from "@/components/date-picker"
import { LifeExpectancySelector } from "@/components/life-expectancy-selector"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

export function LandingPage() {
  // Update the birthDate state to default to 1995
  const [birthDate, setBirthDate] = useState<Date | undefined>(new Date(1995, 0, 1))
  const [lifeExpectancy, setLifeExpectancy] = useState<number>(80)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

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

    // Encode the data in the URL
    const params = new URLSearchParams()
    params.set("dob", birthDate.toISOString())
    params.set("expectancy", lifeExpectancy.toString())

    router.push(`/visualization?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-8"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">My Time Left</h1>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
          Visualize your life's journey - the days you've lived and the precious time that remains.
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.8 }}>
        <Card className="w-full max-w-md bg-white/10 backdrop-blur-lg border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Begin Your Journey</CardTitle>
            <CardDescription className="text-slate-300">
              Enter your date of birth and life expectancy to see your life's timeline.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Date of Birth</label>
              <DatePicker date={birthDate} setDate={setBirthDate} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Life Expectancy (years)</label>
              <LifeExpectancySelector value={lifeExpectancy} onChange={setLifeExpectancy} />
            </div>

            {error && <div className="text-red-400 text-sm font-medium">{error}</div>}
          </CardContent>
          <CardFooter>
            <Button onClick={handleSubmit} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
              Visualize My Time <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="mt-8 text-slate-400 text-sm max-w-md text-center"
      >
        This visualization is meant to inspire mindfulness about how we spend our time. It's not meant to be morbid, but
        rather a gentle reminder of life's finite nature.
      </motion.p>
    </div>
  )
}

