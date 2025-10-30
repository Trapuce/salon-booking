import { LoginForm } from "@/components/login-form"
import { Scissors } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link href="/" className="flex items-center gap-2">
            <Scissors className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-semibold text-foreground">Salon Élégance</h1>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto flex min-h-[calc(100vh-80px)] items-center justify-center px-4">
        <LoginForm />
      </main>
    </div>
  )
}
