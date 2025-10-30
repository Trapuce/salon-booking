import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET - Fetch working hours schedule
export async function GET() {
  try {
    let schedule = await prisma.workingHours.findMany({
      orderBy: { dayOfWeek: "asc" },
    })

    // If no schedule exists, create default schedule
    if (schedule.length === 0) {
      const defaultSchedule = [
        { dayOfWeek: 0, isOpen: false, startTime: "09:00", endTime: "18:00" }, // Sunday
        { dayOfWeek: 1, isOpen: true, startTime: "09:00", endTime: "18:00" }, // Monday
        { dayOfWeek: 2, isOpen: true, startTime: "09:00", endTime: "18:00" }, // Tuesday
        { dayOfWeek: 3, isOpen: true, startTime: "09:00", endTime: "18:00" }, // Wednesday
        { dayOfWeek: 4, isOpen: true, startTime: "09:00", endTime: "18:00" }, // Thursday
        { dayOfWeek: 5, isOpen: true, startTime: "09:00", endTime: "18:00" }, // Friday
        { dayOfWeek: 6, isOpen: true, startTime: "09:00", endTime: "18:00" }, // Saturday
      ]

      await prisma.workingHours.createMany({
        data: defaultSchedule,
      })

      schedule = await prisma.workingHours.findMany({
        orderBy: { dayOfWeek: "asc" },
      })
    }

    return NextResponse.json(schedule)
  } catch (error) {
    console.error("Error fetching schedule:", error)
    return NextResponse.json({ error: "Failed to fetch schedule" }, { status: 500 })
  }
}

// PUT - Update working hours schedule
export async function PUT(request: NextRequest) {
  try {
    const { schedule } = await request.json()

    if (!Array.isArray(schedule)) {
      return NextResponse.json({ error: "Invalid schedule format" }, { status: 400 })
    }

    // Update each day's schedule
    for (const day of schedule) {
      await prisma.workingHours.upsert({
        where: { dayOfWeek: day.dayOfWeek },
        update: {
          isOpen: day.isOpen,
          startTime: day.startTime,
          endTime: day.endTime,
        },
        create: {
          dayOfWeek: day.dayOfWeek,
          isOpen: day.isOpen,
          startTime: day.startTime,
          endTime: day.endTime,
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error updating schedule:", error)
    return NextResponse.json({ error: "Failed to update schedule" }, { status: 500 })
  }
}
