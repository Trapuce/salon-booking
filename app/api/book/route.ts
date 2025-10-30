// API route to create a new appointment booking
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { isSlotAvailable } from "@/lib/db-utils"
import { sendBookingConfirmationEmail } from "@/lib/email"
import { sendSMS, validateFrenchPhone, formatPhoneNumber } from "@/lib/sms"
import { generateQRCodeForEmail } from "@/lib/qr-code"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, date } = body

    // Validate required fields
    if (!name || !email || !date) {
      return NextResponse.json({ error: "Nom, email et date sont requis" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Format d'email invalide" }, { status: 400 })
    }

    // Validate phone number if provided
    if (phone && !validateFrenchPhone(phone)) {
      return NextResponse.json({ error: "Format de numéro de téléphone invalide" }, { status: 400 })
    }

    const appointmentDate = new Date(date)
    const now = new Date()
    
    // Check if date is in the past (with 1 hour buffer)
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000)
    if (appointmentDate < oneHourFromNow) {
      return NextResponse.json({ error: "Impossible de réserver dans le passé ou dans la prochaine heure" }, { status: 400 })
    }

    // Check if slot is available
    const available = await isSlotAvailable(appointmentDate)
    if (!available) {
      return NextResponse.json({ error: "Ce créneau n'est plus disponible" }, { status: 409 })
    }

    // Create the appointment
    const appointment = await prisma.appointment.create({
      data: {
        name,
        email,
        phone: phone ? formatPhoneNumber(phone) : null,
        date: appointmentDate,
        status: "pending",
      },
    })

    // Send confirmation email
    try {
      const appointmentTime = appointmentDate.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      })
      
      // Generate QR code for email
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
      const qrCodeUrl = await generateQRCodeForEmail(baseUrl)
      
      await sendBookingConfirmationEmail({
        to: email,
        name,
        appointmentDate,
        appointmentTime,
        qrCodeUrl,
      })
    } catch (emailError) {
      console.error("Error sending confirmation email:", emailError)
      // Continue even if email fails
    }

    // Send SMS if phone number provided
    if (phone) {
      try {
        const appointmentTime = appointmentDate.toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        })
        
        await sendSMS({
          phone: formatPhoneNumber(phone),
          name,
          appointmentDate,
          appointmentTime,
          type: 'confirmation'
        })
      } catch (smsError) {
        console.error("Error sending SMS:", smsError)
        // Continue even if SMS fails
      }
    }

    return NextResponse.json(
      {
        success: true,
        appointment: {
          id: appointment.id,
          name: appointment.name,
          date: appointment.date,
        },
        notifications: {
          email: true,
          sms: !!phone
        }
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating appointment:", error)
    return NextResponse.json({ error: "Erreur lors de la création du rendez-vous" }, { status: 500 })
  }
}
