// Utility functions for database operations
import { prisma } from "./prisma"

// Get available time slots for a specific date
export async function getAvailableSlots(date: Date) {
  const startOfDay = new Date(date)
  startOfDay.setHours(0, 0, 0, 0)

  const endOfDay = new Date(date)
  endOfDay.setHours(23, 59, 59, 999)

  // Get all booked appointments for the day
  const bookedAppointments = await prisma.appointment.findMany({
    where: {
      date: {
        gte: startOfDay,
        lte: endOfDay,
      },
      status: {
        not: "cancelled",
      },
    },
    select: {
      date: true,
    },
  })

  return bookedAppointments.map((apt) => apt.date.toISOString())
}

// Check if a time slot is available
export async function isSlotAvailable(date: Date): Promise<boolean> {
  const appointment = await prisma.appointment.findFirst({
    where: {
      date: date,
      status: {
        not: "cancelled",
      },
    },
  })

  return !appointment
}

// Generate time slots for a day (9 AM to 6 PM, 30-minute intervals)
export function generateTimeSlots(date: Date): Date[] {
  const slots: Date[] = []
  const baseDate = new Date(date)
  baseDate.setHours(9, 0, 0, 0) // Start at 9 AM

  // Generate slots from 9 AM to 6 PM (18 slots total)
  for (let i = 0; i < 18; i++) {
    const slot = new Date(baseDate)
    slot.setMinutes(baseDate.getMinutes() + i * 30)

    // Only add slots before 6 PM
    if (slot.getHours() < 18) {
      slots.push(slot)
    }
  }

  return slots
}
