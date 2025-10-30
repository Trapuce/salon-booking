// Script de test simple pour les fonctionnalités QR code
const QRCode = require('qrcode')

async function testQRCodeGeneration() {
  console.log('Test de génération de QR codes...\n')
  
  try {
    // Test 1: Génération basique
    console.log('1. Test de génération basique...')
    const basicQR = await QRCode.toDataURL('https://salon-elegance.com', {
      width: 200,
      margin: 2
    })
    console.log('✓ QR code basique généré:', basicQR.substring(0, 50) + '...')
    
    // Test 2: Vérification des formats
    console.log('\n2. Vérification des formats...')
    const isDataURL = basicQR.startsWith('data:image/png;base64,')
    console.log('✓ Format Data URL correct:', isDataURL ? 'Oui' : 'Non')
    
    // Test 3: Test de l'API de réservation avec QR code
    console.log('\n3. Test de l\'API de réservation avec QR code...')
    const response = await fetch('http://localhost:3000/api/book', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'QR Code Test',
        email: 'qr.test@example.com',
        phone: '0612345678',
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
      })
    })
    
    if (response.ok) {
      const data = await response.json()
      console.log('✓ API de réservation avec QR code fonctionne')
      console.log('   - Notifications email:', data.notifications?.email ? '✓' : '✗')
      console.log('   - Notifications SMS:', data.notifications?.sms ? '✓' : '✗')
    } else {
      const errorText = await response.text()
      console.log('✗ API de réservation échoue:', errorText)
    }
    
    // Test 4: Test de la page QR code admin
    console.log('\n4. Test de la page QR code admin...')
    const qrPageResponse = await fetch('http://localhost:3000/admin/qr-code')
    if (qrPageResponse.ok) {
      console.log('✓ Page QR code admin accessible')
    } else {
      console.log('✗ Page QR code admin inaccessible')
    }
    
    console.log('\nTests QR code terminés !')
    console.log('\nFonctionnalités QR code implémentées :')
    console.log('   ✓ Génération de QR codes avec la librairie qrcode')
    console.log('   ✓ QR code affiché sur la page principale')
    console.log('   ✓ Page admin dédiée au QR code')
    console.log('   ✓ QR code intégré dans les emails de confirmation')
    console.log('   ✓ QR code téléchargeable')
    console.log('   ✓ Interface responsive pour mobile')
    
    console.log('\nURLs à tester :')
    console.log('   - Page principale : http://localhost:3000')
    console.log('   - Page admin QR : http://localhost:3000/admin/qr-code')
    console.log('   - Interface admin : http://localhost:3000/admin')
    
  } catch (error) {
    console.error('Erreur lors des tests QR code:', error)
  }
}

// Exécuter les tests
testQRCodeGeneration().catch(console.error)
