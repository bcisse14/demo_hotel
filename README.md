# Demo Hôtel — Réservation directe

Stack: React + Vite (frontend), Symfony + API Platform (backend), Postgres, EasyAdmin, Mailer (Mailpit), Mock Stripe.

## Démarrer en local

- Prérequis: Node 18+, PHP 8.2+, Composer, Docker
- Lancer Postgres + Mailpit:

```
docker compose up -d
```

- Backend (API):

```
cd backend
cp .env .env.local # si besoin, vérifier DATABASE_URL (port 55432)
composer install
php bin/console doctrine:database:create || true
php bin/console doctrine:migrations:migrate -n
php bin/console doctrine:fixtures:load -n
php -S 127.0.0.1:8010 -t public
```

- Frontend:

```
cd frontend
npm install
# Configurez l’URL de l’API si nécessaire
echo 'VITE_API_URL=http://127.0.0.1:8010' > .env.local
npm run dev
```

Accès:
- API: http://127.0.0.1:8010/api
- Admin: http://127.0.0.1:8010/admin
- Mailpit: http://127.0.0.1:8025
- Front: http://127.0.0.1:5173

## Déploiement
- Frontend: Vercel (build: `npm run build`, output: `dist`)
- Backend: Koyeb (Dockerfile) + Neon Postgres; configurez `DATABASE_URL` (Neon), `APP_SECRET`, `MAILER_DSN`.

Déploiement backend (Koyeb + Neon)
- Prérequis: un compte Koyeb et une base Postgres Neon (copiez l'URL JDBC/psql en `DATABASE_URL` avec `sslmode=require`).
- Build & run: Dockerfile dans `backend/` (extensions intl/gd/zip/pgsql), entrypoint `/app/docker/entrypoint.sh` qui attend la DB, lance les migrations et démarre PHP en `public/index.php`.
- Healthcheck: HTTP GET /api sur le port exposé (8000).
- Variables à définir côté Koyeb: `APP_ENV=prod`, `APP_SECRET`, `DATABASE_URL`, `CORS_ALLOW_ORIGIN` (ex: ^https?://(.+\.)?vercel\.app$).

Déploiement frontend (Vercel)
- Définissez `VITE_API_URL` sur l'URL publique du backend Koyeb.

## Pages
- Accueil `/` (hero + widget de réservation)
- Chambres `/chambres` (liste via API)
- Détail `/chambres/:id`
- Réservation `/reservation` (POST + paiement simulé)
- À propos `/a-propos`
- Contact `/contact`

## Données & Paiement simulé
- 4 chambres seedées avec prix, équipements et photos (placeholder)
- Paiement: endpoint `/payments/intent` met à jour la réservation (status confirmed) et envoie un email (via Mailpit)