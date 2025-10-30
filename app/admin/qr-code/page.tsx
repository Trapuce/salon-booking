import { QRCodeComponent } from "@/components/qr-code"
import { Scissors, QrCode } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function QRCodePage() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex items-center justify-between px-3 py-3 md:px-4 md:py-4">
          <Link href="/" className="flex items-center gap-2">
            <Scissors className="h-5 w-5 md:h-6 md:w-6 text-primary flex-shrink-0" />
            <h1 className="text-base md:text-xl font-semibold text-foreground">
              <span>Salon Élégance</span>
              <span className="hidden sm:inline"> - QR Code</span>
            </h1>
          </Link>
          <div className="flex items-center gap-1 md:gap-2">
            <Link href="/admin">
              <Button variant="ghost" size="sm" className="h-9 px-2 md:px-3">
                <QrCode className="h-4 w-4" />
                <span className="ml-0 md:ml-2 hidden sm:inline">Retour</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Code QR de Réservation
            </h2>
            <p className="text-lg text-muted-foreground">
              Partagez ce code QR pour permettre à vos clients d'accéder facilement à la page de réservation
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* QR Code */}
            <div className="flex justify-center">
              <QRCodeComponent 
                url={baseUrl}
                title="Page de réservation"
                description="Scannez pour accéder à la réservation en ligne"
                size={250}
              />
            </div>

            {/* Instructions */}
            <div className="space-y-6">
              <div className="bg-card p-6 rounded-lg border">
                <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <QrCode className="h-5 w-5" />
                  Comment utiliser ce QR code
                </h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">1.</span>
                    <span>Imprimez ce QR code ou affichez-le sur un écran</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">2.</span>
                    <span>Placez-le à un endroit visible dans votre salon</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">3.</span>
                    <span>Vos clients peuvent le scanner avec leur téléphone</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary font-bold">4.</span>
                    <span>Ils seront redirigés directement vers la page de réservation</span>
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50 dark:bg-blue-950/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Conseils d'utilisation
                </h4>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• Placez le QR code à hauteur des yeux</li>
                  <li>• Assurez-vous qu'il y a un bon éclairage</li>
                  <li>• Testez régulièrement que le code fonctionne</li>
                  <li>• Imprimez en haute résolution pour une meilleure lisibilité</li>
                </ul>
              </div>

              <div className="bg-green-50 dark:bg-green-950/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
                <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                  Compatibilité
                </h4>
                <p className="text-sm text-green-800 dark:text-green-200">
                  Ce QR code est compatible avec tous les smartphones modernes (iOS et Android). 
                  Aucune application spéciale n'est requise - utilisez simplement l'appareil photo.
                </p>
              </div>
            </div>
          </div>

          {/* URL de la page */}
          <div className="mt-8 text-center">
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">URL de la page de réservation :</p>
              <code className="text-sm font-mono bg-background px-3 py-1 rounded border">
                {baseUrl}
              </code>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
