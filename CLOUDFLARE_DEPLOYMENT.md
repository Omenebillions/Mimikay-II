# Cloudflare Free Tier Deployment Guide — Mimikay Political Movement (MPM)

This project is designed to run on Cloudflare's Free Plan using Cloudflare Workers, Workers Assets and D1, without requiring Cloudflare R2 or paid storage services.

## 1. Architecture Overview

| Component | Provider | Purpose |
|---|---|---|
| Frontend Hosting | Cloudflare Workers Assets | React application hosting |
| SQL Database | Cloudflare D1 (`mpm-db`) | Application data |
| Image Hosting | External image URLs / Blogger CDN | Image storage and delivery |
| Server-Side API | Cloudflare Worker | API and database operations |
| File Storage | External providers | No R2 dependency |

## 2. Deployment Instructions

### Step 1: Install dependencies

```bash
npm install
```

Authenticate with Cloudflare:

```bash
npx wrangler login
```

### Step 2: Configure Cloudflare D1

The existing database is named `mpm-db`.

Its configuration in `wrangler.jsonc` is:

```json
{
  "binding": "DB",
  "database_name": "mpm-db",
  "database_id": "ddb20f11-fc74-4564-9171-74d08a707685"
}
```

Do not replace the existing database ID with a placeholder.

### Step 3: Apply database migrations

Run:

```bash
npx wrangler d1 execute mpm-db --remote --file=./migrations/0001_initial.sql
```

This applies the initial database schema to the remote D1 database.

### Step 4: Configure Firebase Authentication

The project currently uses its existing Firebase configuration.

In Firebase Console:

1. Open Authentication.
2. Go to Settings.
3. Open Authorized domains.
4. Add your deployed Worker domain.
5. Add your custom domain, if applicable.

Google Sign-In must use the authorized Firebase authentication flow.

### Step 5: Build the frontend

Run:

```bash
npm run build
```

This generates the production frontend in the `dist` directory.

### Step 6: Deploy the Cloudflare Worker

Run:

```bash
npx wrangler deploy
```

The Worker uses the configuration in `wrangler.jsonc`, including the D1 database and static assets binding.

## 3. Image Hosting Strategy

The project does not depend on Cloudflare R2.

Administrators can use externally hosted image URLs, including:

- Google Blogger media hosting.
- Cloudinary.
- Other compatible image-hosting services.

The image URL is stored in D1 and used by the frontend.

## 4. Server-Side Security

- Database write operations must be protected by server-side authentication.
- Public visitors should have read-only access to protected application data.
- Admin requests must be authenticated and authorized by the Worker.
- Never expose admin passwords, tokens, or private credentials in frontend code or public configuration.
- Do not use hardcoded password or email-header bypasses as authentication.
- Cloudflare secrets should be used for any server-side credentials that are genuinely required.

## 5. Important Deployment Notes

- Keep the existing D1 database ID unchanged.
- Do not commit `.env`, `.dev.vars`, private keys, or other credentials.
- Keep `.gitignore` updated.
- Run `npm run build` before deploying.
- Verify the website and API after deployment.
