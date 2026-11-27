# Complete Hostinger Deployment Guide for AuGust Aurea Corporate Website

This guide walks you through deploying the **AuGust Aurea Corporate Website** along with its **Live MySQL Database** and **Node.js Backend Server** on your Hostinger plan.

---

## 1. Architecture Overview

- **Frontend:** React 19 + Tailwind CSS + Vite (compiled into `/dist`).
- **Backend API & Server:** Node.js Express server (`server.js` / `server/server.ts`) running on Hostinger's Node.js runtime.
  - Handles dynamic CMS content sections (`/api/sections`).
  - Handles site-wide SEO metadata (`/api/seo`).
  - Handles media asset uploads (`/api/assets/upload` saved to `/public/uploads`).
  - Serves compiled React frontend (`/dist`) with client-side SPA routing.
- **Database:** Hostinger MySQL Database (managed via hPanel and phpMyAdmin).

---

## 2. Pre-Deployment Checklist

Before uploading, ensure you have:
1. Logged into your **Hostinger hPanel** ([hpanel.hostinger.com](https://hpanel.hostinger.com)).
2. Prepared your domain name (e.g., `augustaurea.co.tz` or your custom domain).
3. The following files ready in your project root:
   - `database_schema.sql` (Database structure and initial seed data).
   - `.env.example` (Template for database credentials).
   - `server.js` (Hostinger Node.js startup file).
   - `dist/` (Compiled production frontend build generated via `npm run build`).

---

## 3. Step 1: Create the MySQL Database in Hostinger

1. Open your **Hostinger hPanel** and select your website/domain.
2. In the left navigation, go to **Databases** → **Management** (or **MySQL Databases**).
3. Under **Create a New MySQL Database And User**, fill in:
   - **MySQL Database name:** e.g., `august_cms` (Hostinger will prefix it, e.g., `u123456789_august_cms`).
   - **MySQL Username:** e.g., `admin` (Hostinger will prefix it, e.g., `u123456789_admin`).
   - **Password:** Choose a strong password (save this, you will need it in `.env`).
4. Click **Create**.
5. Note the full database details displayed under **List of Current MySQL Databases**:
   - **Database:** `u123456789_august_cms`
   - **User:** `u123456789_admin`
   - **Host:** `localhost` (or `127.0.0.1`)
   - **Port:** `3306`

---

## 4. Step 2: Import the Database Schema in phpMyAdmin

1. In the same **MySQL Databases** section, locate your new database and click **Enter phpMyAdmin**.
2. Inside phpMyAdmin, select your database from the left sidebar.
3. Click the **Import** tab in the top navigation bar.
4. Click **Choose File** and upload `database_schema.sql` from your project folder.
5. Click **Import** (or **Go**) at the bottom.
6. Verify that the 3 tables are created:
   - `pages_seo` (Pre-seeded with SEO metadata for all 8 pages).
   - `content_sections` (Stores dynamic CMS edits from Admin Studio).
   - `media_assets` (Stores uploaded library photos and documents).

---

## 5. Step 3: Configure Node.js in Hostinger hPanel

*(For Hostinger Web Hosting / Cloud Hosting plans with Node.js support)*

1. In hPanel, go to **Advanced** → **Node.js** (or search for **Node.js** in the hPanel search bar).
2. Click **Create Application** (or configure existing).
3. Set the following parameters:
   - **Node.js version:** Select **20.x LTS** or **22.x LTS**.
   - **Application mode:** Select **Production**.
   - **Application root:**
     - If you want the site on your main domain root: `public_html` (or create a dedicated folder `/home/u123456789/app`).
   - **Application startup file:** `server.js`
4. Click **Save** or **Create**.
5. Once created, note the **Environment Variables** section (or create a `.env` file as shown in Step 4).

---

## 6. Step 4: Upload Project Files to Hostinger

You can upload using either the **hPanel File Manager** or **SFTP / Git**.

### Method A: File Manager (Fastest & Simplest)

1. On your local machine, run the build command once to make sure `/dist` is fresh:
   ```bash
   npm run build
   ```
2. Select the following files and folders and compress them into a `.zip` file:
   - `dist/` (Required: production frontend assets)
   - `server/` (Required: backend API code)
   - `server.js` (Required: Hostinger entry file)
   - `public/` (Required: static assets & uploads folder)
   - `package.json` (Required: dependencies list)
   - `tsconfig.json`
   - `.env.example`
3. In hPanel, open **Files** → **File Manager** and open your application root (e.g. `public_html`).
4. Click **Upload** → **File** and upload your `.zip` archive.
5. Right-click the uploaded `.zip` in File Manager and select **Extract**.
6. Ensure your file structure looks like this in `public_html`:
   ```text
   public_html/
   ├── dist/
   │   ├── index.html
   │   └── assets/
   ├── server/
   │   └── server.ts
   ├── public/
   │   └── uploads/
   ├── server.js
   ├── package.json
   └── .env
   ```

### Method B: Configure the `.env` File

1. In File Manager, create a new file named `.env` in the same directory as `server.js`.
2. Paste your Hostinger MySQL credentials:
   ```env
   NODE_ENV=production
   PORT=5000
   CMS_SERVER_PORT=5000

   # Hostinger MySQL Database Credentials (from Step 1)
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=u123456789_august_cms
   DB_USER=u123456789_admin
   DB_PASSWORD=YourDatabasePasswordHere

   # Same-domain API endpoint
   VITE_API_URL=/api
   ```
3. Save the file.

---

## 7. Step 5: Install Dependencies & Launch Application

1. In hPanel, navigate back to **Advanced** → **Node.js**.
2. Under your application, locate the **NPM Packages** or **Actions** section.
3. Click **NPM Install** (or **Run npm install**).
   - This installs `express`, `mysql2`, `multer`, `cors`, `dotenv`, and `tsx`.
4. After installation completes, click **Restart Application** or **Start Application**.
5. Ensure the application status shows a green dot with **Running**.

---

## 8. Step 6: Verify Live Deployment

1. **Check Backend API & Database Connection:**
   Open in your browser:
   ```text
   https://yourdomain.com/api/health
   ```
   You should receive a JSON response:
   ```json
   {
     "status": "ok",
     "database": "mysql",
     "db_name": "u123456789_august_cms",
     "timestamp": "2026-11-27T..."
   }
   ```
   *(If `"database"` says `"local_persistent_storage"`, double-check your DB credentials in `.env`)*.

2. **Check the Live Website:**
   Visit:
   ```text
   https://yourdomain.com/
   ```
   - Verify that all pages load instantly.
   - Verify that all images, navigation links, and trade corridor sections render cleanly.

3. **Check the CMS Admin Portal:**
   Visit:
   ```text
   https://yourdomain.com/admin
   ```
   - Look at the top-left badge: **"Live MySQL DB"** should glow green.
   - Test making a quick edit in **Pages & Editor** and clicking **Publish & Save**.
   - Check the **Audience Traffic** tab and test downloading your reports as **CSV** or **Excel (.XLS)**.

---

## 9. Alternative: Hostinger VPS Deployment (PM2 + Nginx + MySQL)

If you are using a **Hostinger VPS** (Ubuntu 22.04 / 24.04), run these commands via SSH:

```bash
# 1. Update system & install Node.js 20 LTS + MySQL Server
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs mysql-server nginx git

# 2. Install PM2 process manager
sudo npm install -g pm2

# 3. Clone or upload your repository
cd /var/www
git clone https://github.com/your-repo/august-aurea.git august-site
cd /var/www/august-site

# 4. Install dependencies and build frontend
npm install
npm run build

# 5. Create production .env
cp .env.example .env
nano .env   # Enter your MySQL credentials

# 6. Start server with PM2
pm2 start server.js --name "august-aurea"
pm2 save
pm2 startup

# 7. Configure Nginx Reverse Proxy (/etc/nginx/sites-available/august)
# Proxy pass to http://localhost:5000 with Certbot SSL
sudo certbot --nginx -d yourdomain.com
```

---

## 10. Frequently Asked Questions & Troubleshooting

| Issue | Cause | Solution |
| :--- | :--- | :--- |
| **API health says `local_persistent_storage`** | MySQL credentials in `.env` are incorrect or user has no permissions. | In hPanel -> MySQL Databases, ensure username has full permissions on the database and check password in `.env`. |
| **Uploaded images return 404** | Folder permissions on `public/uploads`. | In File Manager, right-click `public/uploads` and set permissions to `755` (Read & Write). |
| **Page refresh on `/about` returns 404** | Web server is looking for `/about/index.html` instead of falling back to SPA. | Make sure `.htaccess` (included in `/public`) exists in your root folder. |
| **Changes made in Admin Studio don't persist** | Database table missing. | Verify in phpMyAdmin that `content_sections` table was imported successfully from `database_schema.sql`. |

---

*AuGust Aurea Limited — Corporate Trade & Logistics Infrastructure.*
