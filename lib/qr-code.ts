import QRCode from 'qrcode'

export interface QRCodeOptions {
  size?: number
  margin?: number
  color?: {
    dark: string
    light: string
  }
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H'
}

export async function generateQRCodeDataURL(
  text: string, 
  options: QRCodeOptions = {}
): Promise<string> {
  const defaultOptions = {
    width: 200,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    },
    errorCorrectionLevel: 'M' as const,
    ...options
  }

  try {
    return await QRCode.toDataURL(text, defaultOptions)
  } catch (error) {
    console.error('Error generating QR code:', error)
    throw new Error('Failed to generate QR code')
  }
}

export async function generateQRCodeForBooking(baseUrl: string): Promise<string> {
  return generateQRCodeDataURL(baseUrl, {
    size: 200,
    margin: 2,
    color: {
      dark: '#1f2937', // Gray-800
      light: '#ffffff'
    },
    errorCorrectionLevel: 'M'
  })
}

export async function generateQRCodeForEmail(baseUrl: string): Promise<string> {
  return generateQRCodeDataURL(baseUrl, {
    size: 150,
    margin: 1,
    color: {
      dark: '#000000',
      light: '#ffffff'
    },
    errorCorrectionLevel: 'L'
  })
}


