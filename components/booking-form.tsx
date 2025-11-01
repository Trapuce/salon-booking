"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { TimeSlotPicker } from "@/components/time-slot-picker"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, Loader2 } from "lucide-react"

export function BookingForm() {
  const [step, setStep] = useState<"info" | "datetime" | "confirm">("info")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  // Form data
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState<Date>()
  const [notifications, setNotifications] = useState({ email: false, sms: false })

  // Handle form submission
  const handleSubmit = async () => {
    if (!selectedTime) return

    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          date: selectedTime.toISOString(),
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la réservation")
      }

      // Update notifications state
      setNotifications(data.notifications || { email: false, sms: false })
      setSuccess(true)
      setStep("confirm")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  // Reset form
  const resetForm = () => {
    setName("")
    setEmail("")
    setPhone("")
    setSelectedDate(undefined)
    setSelectedTime(undefined)
    setStep("info")
    setSuccess(false)
    setError("")
    setNotifications({ email: false, sms: false })
  }

  // Success confirmation
  if (success) {
    return (
      <Card className="mx-auto max-w-2xl" id="booking-confirmation">
        <CardContent className="pt-8 pb-8 px-4 sm:pt-12 sm:pb-12 sm:px-6 text-center">
          <CheckCircle2 className="mx-auto mb-4 sm:mb-6 h-12 w-12 sm:h-16 sm:w-16 text-primary" />
          <h3 className="mb-3 sm:mb-4 text-xl sm:text-2xl font-bold text-foreground">Réservation confirmée !</h3>
          <p className="mb-2 text-sm sm:text-base text-muted-foreground">
            Votre rendez-vous a été enregistré avec succès.
          </p>
          
          {/* Booking details card - printable */}
          <div className="rounded-lg border-2 border-primary bg-background p-6 sm:p-8 mb-6 sm:mb-8 shadow-lg print:shadow-none">
            <h4 className="text-lg sm:text-xl font-bold text-primary mb-4">CONFIRMATION DE RENDEZ-VOUS</h4>
            <div className="space-y-3 text-left">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Client :</span>
                <span className="font-semibold">{name}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Date :</span>
                <span className="font-semibold">
                  {selectedTime?.toLocaleDateString("fr-FR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-muted-foreground">Heure :</span>
                <span className="font-semibold">
                  {selectedTime?.toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-muted-foreground">Référence :</span>
                <span className="font-mono text-sm">{`RDV-${Date.now().toString(36).toUpperCase()}`}</span>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t text-center text-sm text-muted-foreground">
              <p className="font-semibold mb-1">Salon Élégance</p>
              <p>Tél : 01 23 45 67 89</p>
              <p>Merci de présenter cette confirmation lors de votre visite</p>
            </div>
          </div>

          {/* Notification status */}
          <div className="mb-6 text-xs sm:text-sm text-muted-foreground">
            <div className="flex flex-col gap-1">
              {notifications.email ? (
                <p className="flex items-center justify-center gap-2">
                  <span className="text-green-600">✓</span>
                  Email de confirmation envoyé
                </p>
              ) : (
                <p className="text-orange-600">
                  Email non envoyé - Configurez Resend API
                </p>
              )}
              {phone && notifications.sms && (
                <p className="flex items-center justify-center gap-2">
                  <span className="text-green-600">✓</span>
                  SMS de confirmation envoyé
                </p>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              onClick={() => window.print()} 
              variant="outline" 
              className="w-full sm:w-auto"
            >
              Imprimer la confirmation
            </Button>
            <Button onClick={resetForm} size="lg" className="w-full sm:w-auto">
              Nouvelle réservation
            </Button>
          </div>

          {/* Print styles */}
          <style jsx>{`
            @media print {
              body * {
                visibility: hidden;
              }
              #booking-confirmation, #booking-confirmation * {
                visibility: visible;
              }
              #booking-confirmation {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
              }
              button {
                display: none !important;
              }
            }
          `}</style>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="text-xl sm:text-2xl">Informations de réservation</CardTitle>
        <CardDescription className="text-sm">
          {step === "info" && "Commencez par entrer vos coordonnées"}
          {step === "datetime" && "Choisissez votre date et heure"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 px-4 sm:px-6">
        {/* Step 1: Personal Information */}
        {step === "info" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nom complet *</Label>
              <Input
                id="name"
                placeholder="Jean Dupont"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="jean.dupont@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Téléphone (optionnel)</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="06 12 34 56 78 ou +33 6 12 34 56 78"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              {phone && !/^(\+33|0)[1-9](\d{8})$/.test(phone.replace(/[\s\.\-]/g, '')) && (
                <p className="text-sm text-orange-600">
                  Format recommandé : 06 12 34 56 78 ou +33 6 12 34 56 78
                </p>
              )}
            </div>

            <Button onClick={() => setStep("datetime")} disabled={!name || !email} className="w-full" size="lg">
              Continuer
            </Button>
          </div>
        )}

        {/* Step 2: Date and Time Selection */}
        {step === "datetime" && (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label>Sélectionnez une date</Label>
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date() || date.getDay() === 0}
                  className="rounded-lg border w-full sm:w-auto"
                />
              </div>
            </div>

            {selectedDate && (
              <div className="space-y-4">
                <Label>Sélectionnez un créneau horaire</Label>
                <TimeSlotPicker date={selectedDate} selectedTime={selectedTime} onSelectTime={setSelectedTime} />
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button onClick={() => setStep("info")} variant="outline" className="w-full sm:flex-1">
                Retour
              </Button>
              <Button onClick={handleSubmit} disabled={!selectedTime || loading} className="w-full sm:flex-1" size="lg">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Réservation...
                  </>
                ) : (
                  "Confirmer la réservation"
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
