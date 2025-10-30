"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Bell, CheckCircle2, AlertCircle } from "lucide-react"

export function ReminderManager() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    details?: any
  } | null>(null)

  const sendReminders = async () => {
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/send-reminders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      })

      const data = await response.json()

      if (response.ok) {
        setResult({
          success: true,
          message: data.message,
          details: data.results,
        })
      } else {
        setResult({
          success: false,
          message: data.error || "Erreur lors de l'envoi des rappels",
        })
      }
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : "Une erreur est survenue",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Gestion des rappels
        </CardTitle>
        <CardDescription>
          Envoyer des rappels automatiques pour les rendez-vous de demain
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          onClick={sendReminders}
          disabled={loading}
          className="w-full"
          size="lg"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Envoi en cours...
            </>
          ) : (
            <>
              <Bell className="mr-2 h-4 w-4" />
              Envoyer les rappels
            </>
          )}
        </Button>

        {result && (
          <Alert variant={result.success ? "default" : "destructive"}>
            {result.success ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">{result.message}</p>
                {result.details && (
                  <div className="text-sm space-y-1">
                    <p>• {result.details.total} rendez-vous trouvés</p>
                    <p>• {result.details.emailSent} emails envoyés</p>
                    <p>• {result.details.smsSent} SMS envoyés</p>
                    {result.details.errors.length > 0 && (
                      <div className="mt-2">
                        <p className="font-medium text-orange-600">Erreurs :</p>
                        {result.details.errors.map((error: string, index: number) => (
                          <p key={index} className="text-xs">• {error}</p>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </AlertDescription>
          </Alert>
        )}

        <div className="text-sm text-muted-foreground space-y-2">
          <p><strong>Note :</strong> Cette fonction envoie des rappels pour tous les rendez-vous de demain.</p>
          <p>• Les emails sont envoyés via Resend</p>
          <p>• Les SMS sont envoyés si un numéro de téléphone est renseigné</p>
          <p>• Les rappels sont envoyés uniquement pour les rendez-vous non annulés</p>
        </div>
      </CardContent>
    </Card>
  )
}


