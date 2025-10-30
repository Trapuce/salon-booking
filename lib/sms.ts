// Service SMS optionnel - peut être implémenté avec Twilio, Vonage, etc.
// Pour l'instant, on simule l'envoi de SMS

export interface SMSData {
  phone: string
  name: string
  appointmentDate: Date
  appointmentTime: string
  type: 'confirmation' | 'reminder'
}

export async function sendSMS(data: SMSData) {
  try {
    const { phone, name, appointmentDate, appointmentTime, type } = data
    
    const formattedDate = appointmentDate.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    })

    let message = ''
    
    if (type === 'confirmation') {
      message = `Salon Élégance - Bonjour ${name}, votre réservation est confirmée pour le ${formattedDate} à ${appointmentTime}. Merci de votre confiance !`
    } else if (type === 'reminder') {
      message = `Salon Élégance - Rappel: Rendez-vous demain ${formattedDate} à ${appointmentTime}. À bientôt !`
    }

    // Simulation d'envoi SMS (à remplacer par un vrai service)
    console.log(`SMS envoyé à ${phone}: ${message}`)
    
    // Ici vous pouvez intégrer un vrai service SMS comme Twilio :
    // const twilio = require('twilio')(accountSid, authToken)
    // const result = await twilio.messages.create({
    //   body: message,
    //   from: '+1234567890', // Votre numéro Twilio
    //   to: phone
    // })
    
    return { success: true, messageId: `sms_${Date.now()}` }
  } catch (error) {
    console.error('Error sending SMS:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

// Fonction pour valider un numéro de téléphone français
export function validateFrenchPhone(phone: string): boolean {
  // Supprime tous les espaces, points, tirets
  const cleaned = phone.replace(/[\s\.\-]/g, '')
  
  // Vérifie les formats français courants
  const patterns = [
    /^0[1-9]\d{8}$/, // 0123456789
    /^\+33[1-9]\d{8}$/, // +33123456789
    /^33[1-9]\d{8}$/, // 33123456789
  ]
  
  return patterns.some(pattern => pattern.test(cleaned))
}

// Fonction pour formater un numéro de téléphone
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/[\s\.\-]/g, '')
  
  if (cleaned.startsWith('+33')) {
    return cleaned
  } else if (cleaned.startsWith('33')) {
    return `+${cleaned}`
  } else if (cleaned.startsWith('0')) {
    return `+33${cleaned.substring(1)}`
  }
  
  return phone
}


