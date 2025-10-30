"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, Clock, Mail, Phone, Loader2, CheckCircle2, Trash2, AlertCircle } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface Appointment {
  id: string
  name: string
  email: string
  phone: string | null
  date: string
  status: string
  createdAt: string
}

export function AppointmentList() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  // Fetch appointments
  const fetchAppointments = async () => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/appointments")
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erreur lors du chargement")
      }

      setAppointments(data.appointments || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAppointments()
  }, [])

  // Mark appointment as completed
  const handleComplete = async (id: string) => {
    setActionLoading(id)

    try {
      const response = await fetch(`/api/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed" }),
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour")
      }

      await fetchAppointments()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
    } finally {
      setActionLoading(null)
    }
  }

  // Delete appointment
  const handleDelete = async () => {
    if (!deleteId) return

    setActionLoading(deleteId)

    try {
      const response = await fetch(`/api/appointments/${deleteId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression")
      }

      await fetchAppointments()
      setDeleteId(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue")
    } finally {
      setActionLoading(null)
    }
  }

  // Filter upcoming appointments
  const upcomingAppointments = appointments.filter((apt) => {
    const aptDate = new Date(apt.date)
    return aptDate >= new Date() && apt.status !== "cancelled"
  })

  // Filter past appointments
  const pastAppointments = appointments.filter((apt) => {
    const aptDate = new Date(apt.date)
    return aptDate < new Date() || apt.status === "completed" || apt.status === "cancelled"
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Upcoming Appointments */}
      <Card>
        <CardHeader>
          <CardTitle>Rendez-vous à venir</CardTitle>
          <CardDescription>
            {upcomingAppointments.length} rendez-vous programmé{upcomingAppointments.length > 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingAppointments.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Aucun rendez-vous à venir</p>
          ) : (
            <div className="space-y-4">
              {upcomingAppointments.map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  onComplete={handleComplete}
                  onDelete={() => setDeleteId(appointment.id)}
                  loading={actionLoading === appointment.id}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Past Appointments */}
      {pastAppointments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Historique</CardTitle>
            <CardDescription>Rendez-vous passés et terminés</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pastAppointments.slice(0, 10).map((appointment) => (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  onDelete={() => setDeleteId(appointment.id)}
                  loading={actionLoading === appointment.id}
                  isPast
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer ce rendez-vous ? Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

// Appointment Card Component
function AppointmentCard({
  appointment,
  onComplete,
  onDelete,
  loading,
  isPast = false,
}: {
  appointment: Appointment
  onComplete?: (id: string) => void
  onDelete: () => void
  loading: boolean
  isPast?: boolean
}) {
  const date = new Date(appointment.date)

  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 rounded-lg border border-border bg-card p-4">
      <div className="flex-1 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h4 className="font-semibold text-sm sm:text-base text-foreground break-words">{appointment.name}</h4>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <Badge variant={appointment.status === "completed" ? "secondary" : "default"} className="text-xs">
                {appointment.status === "completed" ? "Terminé" : "À venir"}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid gap-2 text-xs sm:text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 flex-shrink-0" />
            <span className="break-words">
              {date.toLocaleDateString("fr-FR", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 flex-shrink-0" />
            <span>
              {date.toLocaleTimeString("fr-FR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 flex-shrink-0" />
            <span className="break-all">{appointment.email}</span>
          </div>
          {appointment.phone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 flex-shrink-0" />
              <span>{appointment.phone}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-2 sm:flex-col">
        {!isPast && onComplete && appointment.status !== "completed" && (
          <Button
            onClick={() => onComplete(appointment.id)}
            disabled={loading}
            size="sm"
            variant="outline"
            className="flex-1 sm:flex-none"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
            <span className="ml-2 sm:hidden">Terminer</span>
          </Button>
        )}
        <Button
          onClick={onDelete}
          disabled={loading}
          size="sm"
          variant="outline"
          className="flex-1 sm:flex-none bg-transparent"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          <span className="ml-2 sm:hidden">Supprimer</span>
        </Button>
      </div>
    </div>
  )
}
