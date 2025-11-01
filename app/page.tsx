import { BookingForm } from "@/components/booking-form"
import { BookingQRCode } from "@/components/qr-code"
import { Scissors } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 justify-center">
            <Scissors className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold text-foreground">Salon Élégance</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-4xl">
          {/* Hero Section */}
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-foreground text-balance">Réservez votre rendez-vous</h2>
            <p className="text-lg text-muted-foreground text-pretty">
              Choisissez votre créneau et réservez en quelques clics. Simple et rapide.
            </p>
          </div>

          {/* Booking Form */}
          <BookingForm />
          
          {/* QR Code Section */}
          <BookingQRCode />
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-border bg-card py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>© 2025 Salon Élégance. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  )
}
