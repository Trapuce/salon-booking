"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AppointmentList } from "@/components/appointment-list"

export function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("adminToken")
    if (!token) {
      router.push("/admin/login")
    } else {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return <div className="text-center py-8">Chargement...</div>
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Tableau de bord</h2>
          <p className="text-sm md:text-base text-muted-foreground">Gérez vos rendez-vous</p>
        </div>
      </div>

      <AppointmentList />
    </div>
  )
}
