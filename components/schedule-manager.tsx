"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Clock } from "lucide-react"

interface WorkingDay {
  dayOfWeek: number
  isOpen: boolean
  startTime: string
  endTime: string
}

const DAYS = [
  { value: 1, label: "Lundi" },
  { value: 2, label: "Mardi" },
  { value: 3, label: "Mercredi" },
  { value: 4, label: "Jeudi" },
  { value: 5, label: "Vendredi" },
  { value: 6, label: "Samedi" },
  { value: 0, label: "Dimanche" },
]

// Generate time options from 6:00 to 22:00
const TIME_OPTIONS = Array.from({ length: 33 }, (_, i) => {
  const hour = Math.floor(i / 2) + 6
  const minute = i % 2 === 0 ? "00" : "30"
  return `${hour.toString().padStart(2, "0")}:${minute}`
})

export function ScheduleManager() {
  const [schedule, setSchedule] = useState<WorkingDay[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchSchedule()
  }, [])

  const fetchSchedule = async () => {
    try {
      const response = await fetch("/api/admin/schedule")
      if (response.ok) {
        const data = await response.json()
        setSchedule(data)
      }
    } catch (error) {
      console.error("Error fetching schedule:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleDay = (dayOfWeek: number) => {
    setSchedule((prev) => prev.map((day) => (day.dayOfWeek === dayOfWeek ? { ...day, isOpen: !day.isOpen } : day)))
  }

  const handleTimeChange = (dayOfWeek: number, field: "startTime" | "endTime", value: string) => {
    setSchedule((prev) => prev.map((day) => (day.dayOfWeek === dayOfWeek ? { ...day, [field]: value } : day)))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch("/api/admin/schedule", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schedule }),
      })

      if (response.ok) {
        alert("Horaires sauvegardés avec succès!")
      } else {
        alert("Erreur lors de la sauvegarde")
      }
    } catch (error) {
      console.error("Error saving schedule:", error)
      alert("Erreur lors de la sauvegarde")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <div className="text-center py-8">Chargement...</div>
  }

  return (
    <div className="space-y-6">
      <div className="px-4 sm:px-0">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Gestion des horaires</h2>
        <p className="text-sm sm:text-base text-muted-foreground">Configurez vos jours et heures de travail</p>
      </div>

      <div className="grid gap-4">
        {DAYS.map((day) => {
          const daySchedule = schedule.find((s) => s.dayOfWeek === day.value)
          if (!daySchedule) return null

          return (
            <Card key={day.value}>
              <CardHeader className="px-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base sm:text-lg">{day.label}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Label htmlFor={`day-${day.value}`} className="text-xs sm:text-sm">
                      {daySchedule.isOpen ? "Ouvert" : "Fermé"}
                    </Label>
                    <Switch
                      id={`day-${day.value}`}
                      checked={daySchedule.isOpen}
                      onCheckedChange={() => handleToggleDay(day.value)}
                    />
                  </div>
                </div>
              </CardHeader>
              {daySchedule.isOpen && (
                <CardContent className="px-4 sm:px-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`start-${day.value}`} className="text-sm">
                        Heure de début
                      </Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <select
                          id={`start-${day.value}`}
                          value={daySchedule.startTime}
                          onChange={(e) => handleTimeChange(day.value, "startTime", e.target.value)}
                          className="w-full pl-10 pr-4 py-2 text-sm border border-input rounded-md bg-background"
                        >
                          {TIME_OPTIONS.map((time) => (
                            <option key={time} value={time}>
                              {time}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`end-${day.value}`} className="text-sm">
                        Heure de fin
                      </Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <select
                          id={`end-${day.value}`}
                          value={daySchedule.endTime}
                          onChange={(e) => handleTimeChange(day.value, "endTime", e.target.value)}
                          className="w-full pl-10 pr-4 py-2 text-sm border border-input rounded-md bg-background"
                        >
                          {TIME_OPTIONS.map((time) => (
                            <option key={time} value={time}>
                              {time}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>

      <div className="flex justify-end px-4 sm:px-0">
        <Button onClick={handleSave} disabled={isSaving} size="lg" className="w-full sm:w-auto">
          {isSaving ? "Sauvegarde..." : "Sauvegarder les horaires"}
        </Button>
      </div>
    </div>
  )
}
