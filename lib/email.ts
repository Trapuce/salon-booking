import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY || 'demo-key')

export interface EmailData {
  to: string
  name: string
  appointmentDate: Date
  appointmentTime: string
  qrCodeUrl?: string
}

export async function sendBookingConfirmationEmail(data: EmailData) {
  try {
    // Vérifier si la clé API Resend est configurée
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'demo-key') {
      console.log('Resend API key not configured, simulating email send:', data)
      return { success: true, messageId: 'demo-email-' + Date.now() }
    }

    const { to, name, appointmentDate, appointmentTime, qrCodeUrl } = data
    
    const formattedDate = appointmentDate.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Confirmation de réservation - Salon Élégance</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Salon Élégance</h1>
            <p style="color: #f0f0f0; margin: 10px 0 0 0; font-size: 16px;">Votre beauté, notre passion</p>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #2c3e50; margin-top: 0;">Bonjour ${name},</h2>
            
            <p>Votre réservation a été confirmée avec succès ! Nous avons hâte de vous accueillir dans notre salon.</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea;">
              <h3 style="color: #2c3e50; margin-top: 0;">Détails de votre rendez-vous</h3>
              <p style="margin: 5px 0;"><strong>Date :</strong> ${formattedDate}</p>
              <p style="margin: 5px 0;"><strong>Heure :</strong> ${appointmentTime}</p>
              <p style="margin: 5px 0;"><strong>Statut :</strong> <span style="color: #27ae60; font-weight: bold;">Confirmé</span></p>
            </div>
            
            <div style="background: #e8f4fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <h4 style="color: #2c3e50; margin-top: 0;">Informations importantes :</h4>
              <ul style="margin: 10px 0; padding-left: 20px;">
                <li>Merci d'arriver 5 minutes avant votre rendez-vous</li>
                <li>En cas d'empêchement, veuillez nous prévenir au moins 24h à l'avance</li>
                <li>N'hésitez pas à nous contacter pour toute question</li>
              </ul>
            </div>
            
            <p>Nous vous remercions de votre confiance et nous réjouissons de vous voir bientôt !</p>
            
            ${qrCodeUrl ? `
            <div style="text-align: center; margin: 30px 0; padding: 20px; background: #f8f9fa; border-radius: 8px;">
              <h4 style="color: #2c3e50; margin-bottom: 15px;">Accès mobile rapide</h4>
              <p style="color: #7f8c8d; font-size: 14px; margin-bottom: 15px;">
                Scannez ce code QR pour accéder facilement à notre page de réservation
              </p>
              <img src="${qrCodeUrl}" alt="QR Code de réservation" style="width: 150px; height: 150px; border: 2px solid #ddd; border-radius: 8px;" />
            </div>
            ` : ''}
            
            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #7f8c8d; font-size: 14px;">
                <strong>Salon Élégance</strong><br>
                Tél: 01 23 45 67 89<br>
                Email: contact@salon-elegance.fr<br>
                Web: www.salon-elegance.fr
              </p>
            </div>
          </div>
        </body>
      </html>
    `

    const result = await resend.emails.send({
      from: 'Salon Élégance <onboarding@resend.dev>',
      to: [to],
      subject: `Confirmation de réservation - ${formattedDate} à ${appointmentTime}`,
      html: emailHtml,
    })

    console.log('Email sent successfully:', result)
    return { success: true, messageId: result.data?.id }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function sendBookingReminderEmail(data: EmailData) {
  try {
    // Vérifier si la clé API Resend est configurée
    if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === 'demo-key') {
      console.log('Resend API key not configured, simulating reminder email send:', data)
      return { success: true, messageId: 'demo-reminder-' + Date.now() }
    }

    const { to, name, appointmentDate, appointmentTime } = data
    
    const formattedDate = appointmentDate.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Rappel de rendez-vous - Salon Élégance</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #f39c12 0%, #e67e22 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Salon Élégance</h1>
            <p style="color: #f0f0f0; margin: 10px 0 0 0; font-size: 16px;">Rappel de rendez-vous</p>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
            <h2 style="color: #2c3e50; margin-top: 0;">Bonjour ${name},</h2>
            
            <p>Ceci est un rappel amical pour votre rendez-vous demain au Salon Élégance.</p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f39c12;">
              <h3 style="color: #2c3e50; margin-top: 0;">Votre rendez-vous</h3>
              <p style="margin: 5px 0;"><strong>Date :</strong> ${formattedDate}</p>
              <p style="margin: 5px 0;"><strong>Heure :</strong> ${appointmentTime}</p>
            </div>
            
            <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #ffeaa7;">
              <h4 style="color: #856404; margin-top: 0;">N'oubliez pas :</h4>
              <ul style="margin: 10px 0; padding-left: 20px; color: #856404;">
                <li>Arrivez 5 minutes avant votre heure de rendez-vous</li>
                <li>Apportez votre carte d'identité si nécessaire</li>
                <li>En cas d'empêchement, contactez-nous rapidement</li>
              </ul>
            </div>
            
            <p>Nous avons hâte de vous voir demain !</p>
            
            <div style="text-align: center; margin-top: 30px;">
              <p style="color: #7f8c8d; font-size: 14px;">
                <strong>Salon Élégance</strong><br>
                Tél: 01 23 45 67 89<br>
                Email: contact@salon-elegance.fr
              </p>
            </div>
          </div>
        </body>
      </html>
    `

    const result = await resend.emails.send({
      from: 'Salon Élégance <onboarding@resend.dev>',
      to: [to],
      subject: `Rappel de rendez-vous - Demain ${formattedDate} à ${appointmentTime}`,
      html: emailHtml,
    })

    console.log('Reminder email sent successfully:', result)
    return { success: true, messageId: result.data?.id }
  } catch (error) {
    console.error('Error sending reminder email:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}
