"use client"

import { useEffect, useState } from "react"
import QRCode from "qrcode"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, QrCode, Smartphone } from "lucide-react"

interface QRCodeProps {
  url: string
  title?: string
  description?: string
  size?: number
  showDownload?: boolean
}

export function QRCodeComponent({ 
  url, 
  title = "Code QR de réservation", 
  description = "Scannez ce code pour accéder à la page de réservation",
  size = 200,
  showDownload = true 
}: QRCodeProps) {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    const generateQRCode = async () => {
      try {
        setLoading(true)
        setError("")
        
        const qrCodeOptions = {
          width: size,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          },
          errorCorrectionLevel: 'M' as const
        }

        const dataUrl = await QRCode.toDataURL(url, qrCodeOptions)
        setQrCodeDataUrl(dataUrl)
      } catch (err) {
        console.error('Error generating QR code:', err)
        setError('Erreur lors de la génération du QR code')
      } finally {
        setLoading(false)
      }
    }

    if (url) {
      generateQRCode()
    }
  }, [url, size])

  const downloadQRCode = () => {
    if (qrCodeDataUrl) {
      const link = document.createElement('a')
      link.download = 'salon-elegance-qr-code.png'
      link.href = qrCodeDataUrl
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  if (loading) {
    return (
      <Card className="w-fit mx-auto">
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2 text-sm text-muted-foreground">Génération du QR code...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-fit mx-auto">
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <QrCode className="h-8 w-8 mx-auto mb-2" />
            <p className="text-sm">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-fit mx-auto">
      <CardHeader className="text-center pb-4">
        <CardTitle className="text-lg flex items-center justify-center gap-2">
          <QrCode className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription className="text-sm">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <div className="flex justify-center">
          <div className="p-4 bg-white rounded-lg border-2 border-gray-200">
            <img 
              src={qrCodeDataUrl} 
              alt="QR Code de réservation" 
              className="block"
              style={{ width: size, height: size }}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">
            Scannez avec votre appareil photo
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Smartphone className="h-4 w-4" />
            <span>Compatible iOS et Android</span>
          </div>
        </div>

        {showDownload && (
          <Button 
            onClick={downloadQRCode}
            variant="outline" 
            size="sm"
            className="w-full"
          >
            <Download className="h-4 w-4 mr-2" />
            Télécharger le QR code
          </Button>
        )}
      </CardContent>
    </Card>
  )
}

// Composant pour afficher le QR code dans la page de réservation
export function BookingQRCode() {
  const [currentUrl, setCurrentUrl] = useState("")

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.origin)
    }
  }, [])

  return (
    <div className="mt-8">
      <QRCodeComponent 
        url={currentUrl}
        title="Réservez facilement"
        description="Scannez ce code pour accéder à la page de réservation depuis votre mobile"
        size={180}
      />
    </div>
  )
}

// Composant pour afficher le QR code dans les emails
export function EmailQRCode({ url }: { url: string }) {
  return (
    <div style={{ textAlign: 'center', margin: '20px 0' }}>
      <QRCodeComponent 
        url={url}
        title=""
        description=""
        size={150}
        showDownload={false}
      />
    </div>
  )
}


