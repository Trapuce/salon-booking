# Sécurité Admin - Salon Booking

## Protection mise en place

L'interface admin est maintenant protégée par :
- **Authentification HTTP Basic**
- **Middleware Next.js** qui vérifie les identifiants
- **Pas de lien visible** sur la page publique

## Accès à l'interface admin

### URL
```
https://barber-time.trapuce.tech/admin
```

### Identifiants
- **Utilisateur** : `admin`
- **Mot de passe** : Celui défini dans votre fichier `.env` (variable `ADMIN_PASSWORD`)

### Comment ça fonctionne

1. Quand vous accédez à `/admin`, le navigateur demande un login/mot de passe
2. Entrez `admin` comme nom d'utilisateur
3. Entrez le mot de passe défini dans `.env`
4. Le navigateur garde la session active jusqu'à fermeture

## Changer le mot de passe

Sur votre VPS :
```bash
cd /infra-traefik/apps/salon-booking

# Éditer le .env
nano .env

# Modifier la ligne ADMIN_PASSWORD
ADMIN_PASSWORD=NouveauMotDePasseTresSecurise2024!

# Redémarrer l'application
docker compose restart
```

## Sécurité supplémentaire

Pour encore plus de sécurité, vous pouvez :

1. **Utiliser un mot de passe très fort** : 
   - Au moins 12 caractères
   - Mélange de lettres, chiffres, symboles
   - Exemple : `S@l0n!2024#Adm1n$ecur3`

2. **Limiter l'accès par IP** (dans Traefik) :
   ```yaml
   labels:
     - "traefik.http.middlewares.admin-whitelist.ipwhitelist.sourcerange=VOTRE_IP/32"
     - "traefik.http.routers.salon-booking.middlewares=admin-whitelist@docker"
   ```

3. **Changer régulièrement** le mot de passe admin

## Test de sécurité

Pour vérifier que la protection fonctionne :
```bash
# Sans authentification (doit retourner 401)
curl -I https://barber-time.trapuce.tech/admin

# Avec authentification (doit retourner 200)
curl -I -u admin:VOTRE_MOT_DE_PASSE https://barber-time.trapuce.tech/admin
```
