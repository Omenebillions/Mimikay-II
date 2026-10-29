# Cloudflare Free Tier Deployment Guide — Mimikay Political Movement (MPM)

This project is architected specifically to run **100% on Cloudflare's Free Plan** with **Cloudflare Pages** and **Cloudflare D1**, with **zero dependencies on Cloudflare R2 or any paid storage services**.

---

## 1. 100% Free Architecture Overview

| Component | Provider & Tier | Cost | Limits on Free Tier |
| :--- | :--- | :--- | :--- |
| **Frontend Hosting** | Cloudflare Pages (or Workers Assets) | **Free ($0.00)** | Unlimited requests, global CDN, SSL |
| **SQL Database** | Cloudflare D1 (`mpm-db`) | **Free ($0.00)** | 5,000,000 read rows/day, 100,000 write rows/day, 5 GB storage |
| **Image Hosting** | Google Blogger CDN / External URLs | **Free ($0.00)** | High bandwidth, zero storage cost |
| **Server-Side API** | Cloudflare Pages Functions / Worker | **Free ($0.00)** | 100,000 requests/day, server-side auth |
| **Storage (R2/S3)** | **NONE (Disabled)** | **Free ($0.00)** | No credit card, no subscription, no paid tier |

---

## 2. Step-by-Step Deployment Instructions

### Step 1: Install Wrangler CLI
```bash
npm install -g wrangler
# or use:
npx wrangler login
```

### Step 2: Create the Free Cloudflare D1 Database
Run the following command to provision a free D1 database:
```bash
npx wrangler d1 create mpm-db
```
Wrangler will display your database binding configuration, for example:
```json
{
  "binding": "DB",
  "database_name": "mpm-db",
  "database_id": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
}
```
Copy that `database_id` and paste it into `wrangler.jsonc` under `d1_databases[0].database_id`.

### Step 3: Run the Schema & Authoritative Seed Migration
Execute the idempotent SQL migration in `migrations/0001_initial.sql`. This sets up the `site_settings`, `events`, `campaigns`, and `candidates` tables and seeds the authoritative MPM data (including Blogger image URLs and YouTube embeds):

```bash
npx wrangler d1 execute mpm-db --file=./migrations/0001_initial.sql
```

### Step 4: Build the Frontend Static Assets
```bash
npm run build
```
This compiles the React 19 SPA into the `./dist` directory.

### Step 5: Deploy to Cloudflare
You can deploy using either **Cloudflare Pages** or the **Cloudflare Worker**:

#### Option A: Deploy via Cloudflare Pages (Recommended)
```bash
npx wrangler pages deploy dist --project-name=mpm-website
```
Bind the D1 database to the Pages project in the Cloudflare Dashboard:
`Workers & Pages -> mpm-website -> Settings -> Functions -> D1 Database Bindings -> Variable: DB, Database: mpm-db`.

#### Option B: Deploy via Unified Cloudflare Worker with Assets
```bash
npx wrangler deploy
```

---

## 3. Image Strategy & How Direct Uploads Can Be Enabled Free

To strictly respect the requirement of **no paid services or credit card subscriptions**, Cloudflare R2 is omitted.

### How Images Work Currently (Zero Cost)
- Administrators enter image URLs directly in the Admin Dashboard (`/admin`).
- An authoritative gallery palette of existing MPM Blogger photos is available in 1 click inside the form.
- You can also upload any image for free to:
  1. Your existing Google Blogger media library (`blogger.googleusercontent.com`)
  2. Free Cloudinary account (25 GB free storage)
  3. Free Imgur / Postimages
- Paste the resulting image URL into the Image URL field. It previews immediately and saves to Cloudflare D1.

### How to Enable Direct Uploads in the Future (100% Free)
If direct device file upload is ever needed without paying for Cloudflare R2, you can use:
1. **Free Cloudinary (Recommended)**:
   - Sign up for a free Cloudinary account (25 GB free monthly bandwidth & storage).
   - Create an **unsigned upload preset** in Cloudinary settings.
   - Point the client-side or worker POST directly to `https://api.cloudinary.com/v1_1/<cloud_name>/image/upload`.
2. **Free Imgur API**:
   - Register a free client application on Imgur.
   - Send the image file with `Authorization: Client-ID <YOUR_CLIENT_ID>`.
3. **GitHub Repository / Releases API**:
   - Upload assets to a free public GitHub repository using a GitHub token.

---

## 4. Server-Side Security & Authentication

- All database write operations (`POST /api/events`, `DELETE /api/events/:id`, `POST /api/settings`, `POST /api/candidates`) are validated on the server side (`worker/index.ts` or `functions/api/[[path]].ts`).
- Requests require a valid `Authorization: Bearer <passphrase>` header or authorized admin email verification (`tintvillenigeria@gmail.com`).
- Public frontend visitors only have read access (`GET /api/*`).
