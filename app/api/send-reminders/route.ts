// API route to send appointment reminders
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { sendBookingReminderEmail } from "@/lib/email"
import { sendSMS } from "@/lib/sms"

export async function POST(request: Request) {
  try {
    // Get tomorrow's date
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(0, 0, 0, 0)

    const endOfTomorrow = new Date(tomorrow)
    endOfTomorrow.setHours(23, 59, 59, 999)

    // Find appointments for tomorrow
    const appointments = await prisma.appointment.findMany({
      where: {
        date: {
          gte: tomorrow,
          lte: endOfTomorrow,
        },
        status: {
          not: "cancelled",
        },
      },
    })

    const results = {
      total: appointments.length,
      emailSent: 0,
      smsSent: 0,
      errors: [] as string[],
    }

    // Send reminders for each appointment
    for (const appointment of appointments) {
      const appointmentTime = appointment.date.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      })

      // Send email reminder
      try {
        await sendBookingReminderEmail({
          to: appointment.email,
          name: appointment.name,
          appointmentDate: appointment.date,
          appointmentTime,
        })
        results.emailSent++
      } catch (error) {
        results.errors.push(`Email failed for ${appointment.name}: ${error instanceof Error ? error.message : 'Unknown error'}`)
      }

      // Send SMS reminder if phone number exists
      if (appointment.phone) {
        try {
          await sendSMS({
            phone: appointment.phone,
            name: appointment.name,
            appointmentDate: appointment.date,
            appointmentTime,
            type: 'reminder'
          })
          results.smsSent++
        } catch (error) {
          results.errors.push(`SMS failed for ${appointment.name}: ${error instanceof Error ? error.message : 'Unknown error'}`)
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Rappels envoyés: ${results.emailSent} emails, ${results.smsSent} SMS`,
      results,
    })
  } catch (error) {
    console.error("Error sending reminders:", error)
    return NextResponse.json(
      { error: "Erreur lors de l'envoi des rappels" },
      { status: 500 }
    )
  }
}


