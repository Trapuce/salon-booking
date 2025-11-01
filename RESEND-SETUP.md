# Configuration Email avec Resend

## Étapes pour activer les emails

### 1. Créer un compte Resend (Gratuit)

1. Allez sur https://resend.com
2. Créez un compte gratuit (100 emails/jour gratuits)
3. Confirmez votre email

### 2. Obtenir votre clé API

1. Dans le dashboard Resend, allez dans "API Keys"
2. Cliquez sur "Create API Key"
3. Donnez un nom (ex: "salon-booking")
4. Copiez la clé qui commence par `re_`

### 3. Configurer sur votre VPS

```bash
# Sur votre VPS
cd /infra-traefik/apps/salon-booking

# Éditer le fichier .env
nano .env

# Ajouter votre clé Resend
RESEND_API_KEY=re_xxxxxxxxxx

# Sauvegarder et quitter (Ctrl+X, Y, Enter)

# Redémarrer l'application
docker compose restart
```

### 4. Tester

1. Faites une réservation sur https://barber-time.trapuce.tech
2. Vérifiez votre boîte email
3. L'email devrait arriver dans les 30 secondes

## Notes importantes

- **Domaine par défaut** : Les emails sont envoyés depuis `onboarding@resend.dev` (domaine de test gratuit)
- **Pour un domaine personnalisé** : Vous devez vérifier votre domaine dans Resend (payant)
- **Limite gratuite** : 100 emails/jour, 3000/mois

## En cas de problème

Vérifiez les logs :
```bash
docker compose logs salon-booking | grep -i email
```

## Alternative : Preuve de rendez-vous sans email

J'ai ajouté une fonctionnalité d'impression directe :
- Après la réservation, le client voit un récapitulatif détaillé
- Un bouton "Imprimer la confirmation" permet d'avoir une preuve papier
- Un numéro de référence unique est généré pour chaque rendez-vous

Cette solution fonctionne même sans configuration d'email !
