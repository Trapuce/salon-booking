import { AdminDashboard } from "@/components/admin-dashboard"
import { ReminderManager } from "@/components/reminder-manager"
import { Scissors, Calendar, Settings, QrCode } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center justify-between px-3 py-3 md:px-4 md:py-4">
          <Link href="/" className="flex items-center gap-2">
            <Scissors className="h-5 w-5 md:h-6 md:w-6 text-primary flex-shrink-0" />
            <h1 className="text-base md:text-xl font-semibold text-foreground">
              <span>Salon Élégance</span>
              <span className="hidden sm:inline"> - Admin</span>
            </h1>
          </Link>
          <div className="flex items-center gap-1 md:gap-2">
            <Link href="/admin">
              <Button variant="ghost" size="sm" className="h-9 px-2 md:px-3">
                <Calendar className="h-4 w-4" />
                <span className="ml-0 md:ml-2 hidden sm:inline">Rendez-vous</span>
              </Button>
            </Link>
            <Link href="/admin/schedule">
              <Button variant="ghost" size="sm" className="h-9 px-2 md:px-3">
                <Settings className="h-4 w-4" />
                <span className="ml-0 md:ml-2 hidden sm:inline">Horaires</span>
              </Button>
            </Link>
            <Link href="/admin/qr-code">
              <Button variant="ghost" size="sm" className="h-9 px-2 md:px-3">
                <QrCode className="h-4 w-4" />
                <span className="ml-0 md:ml-2 hidden sm:inline">QR Code</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <AdminDashboard />
          <ReminderManager />
        </div>
      </main>
    </div>
  )
}
