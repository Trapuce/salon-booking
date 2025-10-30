// API route to get all appointments (admin only)
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Fetch all appointments, ordered by date
    const appointments = await prisma.appointment.findMany({
      orderBy: {
        date: "asc",
      },
    })

    return NextResponse.json({
      success: true,
      appointments,
    })
  } catch (error) {
    console.error("Error fetching appointments:", error)
    return NextResponse.json({ error: "Erreur lors de la récupération des rendez-vous" }, { status: 500 })
  }
}
