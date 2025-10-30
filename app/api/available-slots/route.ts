// API route to get available time slots for a specific date
import { NextResponse } from "next/server"
import { getAvailableSlots } from "@/lib/db-utils"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const dateParam = searchParams.get("date")

    if (!dateParam) {
      return NextResponse.json({ error: "Date parameter is required" }, { status: 400 })
    }

    const date = new Date(dateParam)

    // Get booked slots for the date
    const bookedSlots = await getAvailableSlots(date)

    return NextResponse.json({
      success: true,
      bookedSlots,
    })
  } catch (error) {
    console.error("Error fetching available slots:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération des créneaux" }, { status: 500 })
  }
}
