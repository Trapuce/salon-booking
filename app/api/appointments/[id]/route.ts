// API route to update or delete a specific appointment (admin only)
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// Update appointment status
export async function PATCH(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  try {
    const { id } = params
    const body = await request.json()
    const { status } = body

    if (!status) {
      return NextResponse.json({ error: "Status is required" }, { status: 400 })
    }

    // Validate status
    const validStatuses = ["pending", "completed", "cancelled"]
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    // Update the appointment
    const appointment = await prisma.appointment.update({
      where: { id },
      data: { status },
    })

    return NextResponse.json({
      success: true,
      appointment,
    })
  } catch (error) {
    console.error("Error updating appointment:", error)
    return NextResponse.json({ error: "Erreur lors de la mise à jour du rendez-vous" }, { status: 500 })
  }
}

// Delete appointment
export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  try {
    const { id } = params

    // Delete the appointment
    await prisma.appointment.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: "Rendez-vous supprimé",
    })
  } catch (error) {
    console.error("Error deleting appointment:", error)
    return NextResponse.json({ error: "Erreur lors de la suppression du rendez-vous" }, { status: 500 })
  }
}
