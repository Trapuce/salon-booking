"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface TimeSlotPickerProps {
  date: Date
  selectedTime?: Date
  onSelectTime: (time: Date) => void
}

export function TimeSlotPicker({ date, selectedTime, onSelectTime }: TimeSlotPickerProps) {
  const [slots, setSlots] = useState<Date[]>([])
  const [bookedSlots, setBookedSlots] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Generate time slots for the selected date
    const generateSlots = () => {
      const slots: Date[] = []
      const baseDate = new Date(date)
      baseDate.setHours(9, 0, 0, 0)

      for (let i = 0; i < 18; i++) {
        const slot = new Date(baseDate)
        slot.setMinutes(baseDate.getMinutes() + i * 30)
        if (slot.getHours() < 18) {
          slots.push(slot)
        }
      }

      return slots
    }

    setSlots(generateSlots())

    // Fetch booked slots from API
    const fetchBookedSlots = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/available-slots?date=${date.toISOString()}`)
        const data = await response.json()
        setBookedSlots(data.bookedSlots || [])
      } catch (error) {
        console.error("Error fetching booked slots:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBookedSlots()
  }, [date])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
      {slots.map((slot) => {
        const isBooked = bookedSlots.includes(slot.toISOString())
        const isSelected = selectedTime?.getTime() === slot.getTime()
        const isPast = slot < new Date()

        return (
          <Button
            key={slot.toISOString()}
            variant={isSelected ? "default" : "outline"}
            disabled={isBooked || isPast}
            onClick={() => onSelectTime(slot)}
            className="h-auto py-3"
          >
            {slot.toLocaleTimeString("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Button>
        )
      })}
    </div>
  )
}
