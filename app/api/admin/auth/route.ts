// API route for admin authentication
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { password } = body

    // Get admin password from environment variable
    const adminPassword = process.env.ADMIN_PASSWORD || "salon2024"

    // Check if password matches
    if (password !== adminPassword) {
      return NextResponse.json({ error: "Mot de passe incorrect" }, { status: 401 })
    }

    const token = Buffer.from(`${password}-${Date.now()}`).toString("base64")

    return NextResponse.json({
      success: true,
      token,
      message: "Authentification réussie",
    })
  } catch (error) {
    console.error("Error during authentication:", error)
    return NextResponse.json({ error: "Erreur d'authentification" }, { status: 500 })
  }
}
