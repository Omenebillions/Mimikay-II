# Cloudflare Deployment Guide — Mimikay Political Movement (MPM)

This project is architected specifically for zero-dependency Cloudflare deployment (no Vercel, Firebase, or Supabase required).

## Architecture

- **Frontend**: React 19 + TypeScript + Tailwind CSS
- **Backend API**: Cloudflare Worker (`worker/index.ts`)
- **Database**: Cloudflare D1 SQL database (`migrations/0001_initial.sql`)
- **Image Storage**: Cloudflare R2 bucket (`mpm-images`)
- **Routing**: Cloudflare Workers with Static Assets

---

## 1. Prerequisites

Ensure you have Node.js and Wrangler installed:

```bash
npm install -g wrangler
# or use npx wrangler
wrangler login
```

---

## 2. Step-by-Step Deployment

### Step 1: Create the Cloudflare D1 Database
```bash
npx wrangler d1 create mpm-db
```
Wrangler will output:
```
database_id = "xxxx-xxxx-xxxx-xxxx"
```
Copy that ID and paste it into `wrangler.jsonc` under `d1_databases[0].database_id`.

### Step 2: Seed the Database with Authoritative MPM Content
Execute the initial idempotent migration. This creates the schema and seeds all four original MPM events, core pillars, and site settings:

```bash
npx wrangler d1 execute mpm-db --file=./migrations/0001_initial.sql
```

### Step 3: Create the R2 Storage Bucket
Create the R2 bucket for uploading new movement photographs:

```bash
npx wrangler r2 bucket create mpm-images
```

### Step 4: Build Frontend Assets
Build the optimized production frontend:

```bash
npm run build
```

### Step 5: Deploy to Cloudflare
```bash
npx wrangler deploy
```

---

## 3. Administrator Access

- Public route: `/admin`
- Default admin passcode: `mpm2026`
- Once logged in, administrators can create new stories, publish/unpublish articles, edit the homepage hero headlines, configure campaign pop-up modals, and restore seed data anytime without redeploying.
