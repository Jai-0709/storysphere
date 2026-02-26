# 🚀 StorySphere — Free Deployment Guide

**Deploy your full app for FREE in ~20 minutes**
- Frontend → **Vercel** (free forever)
- Backend → **Railway** (free $5/month credit, renews monthly)
- Database → **Railway MySQL** (included in Railway, no extra cost)

> **No credit card needed. Works on any computer.**

---

## 🗺️ Overview — What We Will Do

```
Step 1  → Push your code to GitHub    (required first!)
Step 2  → Deploy Backend on Railway   (API + Database)
Step 3  → Deploy Frontend on Vercel   (the website)
Step 4  → Connect them together       (2 quick settings)
Step 5  → Test your live app          (make sure everything works)
```

---

## ✅ Before You Start — Checklist

Make sure you have all of these ready:

| Requirement | How to get it |
|-------------|--------------|
| **GitHub account** | Free at [github.com](https://github.com) |
| **Node.js installed** | Download at [nodejs.org](https://nodejs.org) (LTS version) |
| **StorySphere code** | Your project folder on your computer |

---

---

# STEP 1 — Push Code to GitHub

> 📌 **This is required.** Railway and Vercel both need your code on GitHub to deploy.

### 1.1 — Create a New GitHub Repository

1. Go to [github.com](https://github.com) and log in
2. Click the **"+"** (top right) → **"New repository"**
3. Fill in:
   - **Repository name:** `storysphere`
   - **Visibility:** Public ✅ (required for free tier)
   - Leave everything else as default
4. Click **"Create repository"**

Do NOT add README or .gitignore yet — keep the repo empty.

---

### 1.2 — Upload Your Code

Open a terminal (PowerShell on Windows) and run these commands **one by one**:

```bash
# Go to your storysphere project folder
cd c:\Users\mjais\.gemini\antigravity\scratch\storysphere

# Set up git (if not already done)
git init
git add .
git commit -m "Initial commit"

# Connect to your GitHub repo (replace YOUR_USERNAME with your actual GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/storysphere.git
git branch -M main
git push -u origin main
```

**✅ Done!** Go to your GitHub repo — you should see all your files there.

---

---

# STEP 2 — Deploy Backend on Railway

Railway will host your **backend (API)** and **MySQL database** together.

---

### 2.1 — Create a Railway Account

1. Go to [railway.app](https://railway.app)
2. Click **"Login"** → **"Login with GitHub"**
3. Authorize Railway to access your GitHub
4. ✅ You now have a Railway account (free, no credit card)

---

### 2.2 — Create a New Project on Railway

1. From the Railway dashboard, click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Find and click your **`storysphere`** repository
4. Railway asks "Which folder?" — type **`backend`** (this is important!)
5. Click **"Deploy Now"**
6. Wait ~1 minute — Railway will try to build your app

> ⚠️ **It will fail at first** because we haven't set environment variables yet. That's okay — continue to next step.

---

### 2.3 — Add a MySQL Database

1. In your Railway project dashboard, click **"New"** (top right of the canvas)
2. Select **"Database"** → **"Add MySQL"**
3. Railway creates a MySQL database and automatically links it to your project ✅

---

### 2.4 — Set Environment Variables

1. Click on your **backend service** (not MySQL) in the Railway dashboard
2. Go to **"Variables"** tab
3. Click **"New Variable"** and add each of these one by one:

| Variable Name | Value |
|---------------|-------|
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `JWT_SECRET` | `mysupersecretkey2024changeThisNow!` (use any long random string) |
| `JWT_EXPIRE` | `7d` |
| `FRONTEND_URL` | `http://localhost:3000` (we'll update this later in Step 4) |
| `DB_HOST` | Click **"Add Reference"** → select MySQL → choose `MYSQLHOST` |
| `DB_USER` | Click **"Add Reference"** → select MySQL → choose `MYSQLUSER` |
| `DB_PASSWORD` | Click **"Add Reference"** → select MySQL → choose `MYSQLPASSWORD` |
| `DB_NAME` | Click **"Add Reference"** → select MySQL → choose `MYSQLDATABASE` |
| `DB_PORT` | Click **"Add Reference"** → select MySQL → choose `MYSQLPORT` |

> 💡 **What is "Add Reference"?** Instead of copy-pasting database passwords, Railway lets you "link" variables from the MySQL service directly. This is safer and automatic.

After adding variables, Railway will **automatically redeploy** your backend.

---

### 2.5 — Set Up Database Tables (Schema)

Your database is empty — we need to create the tables.

**Option A (Web — Easiest):**

1. In Railway dashboard, click your **MySQL** service
2. Click **"Connect"** tab
3. Click **"MySQL Terminal"** (opens a database shell in your browser)
4. Open the file `backend/config/schema.sql` (in your project) in a text editor
5. **Copy all the SQL** from that file
6. **Paste it** into the Railway MySQL Terminal
7. Press **Enter**
8. You should see `Query OK` messages — tables are created ✅

**Option B (Command Line — if you have MySQL installed):**

```bash
# First get your DB details from Railway → MySQL → Connect tab
# Then run:
mysql -h <MYSQLHOST> -u <MYSQLUSER> -p<MYSQLPASSWORD> <MYSQLDATABASE> < backend/config/schema.sql
```

---

### 2.6 — Generate a Public URL for Your Backend

1. Click your **backend service** in Railway
2. Click **"Settings"** tab
3. Scroll to **"Networking"** section
4. Click **"Generate Domain"**
5. Railway gives you a URL like:
   ```
   https://storysphere-backend-production.up.railway.app
   ```
6. **Copy and save this URL** 📝 — you'll need it in the next step.

**Test your backend:**
Open your browser and go to:
```
https://YOUR-RAILWAY-URL.up.railway.app/api/genres
```
You should see `{"data": [...]}` — your backend is live! ✅

---

---

# STEP 3 — Deploy Frontend on Vercel

Vercel will host the **website** (what users see in their browser).

---

### 3.1 — Create a Vercel Account

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"** → **"Continue with GitHub"**
3. Authorize Vercel
4. ✅ Free account created — no credit card needed

---

### 3.2 — Import Your Project

1. From Vercel dashboard, click **"Add New..."** → **"Project"**
2. Find your **`storysphere`** GitHub repository → click **"Import"**
3. Under **"Configure Project"**:
   - **Framework Preset:** `Vite` (Vercel usually detects this automatically)
   - **Root Directory:** Click **"Edit"** → type **`frontend`** → click **"Continue"**
   - **Build Command:** `npm run build` (leave as default)
   - **Output Directory:** `dist` (leave as default)

---

### 3.3 — Add Environment Variable

Still on the same "Configure Project" page:

1. Expand **"Environment Variables"** section
2. Add this variable:

| Name | Value |
|------|-------|
| `VITE_API_URL` | `https://YOUR-RAILWAY-URL.up.railway.app/api` |

> ⚠️ **Important:** Replace `YOUR-RAILWAY-URL` with the Railway URL you copied in Step 2.6. Don't forget the `/api` at the end!

---

### 3.4 — Deploy!

Click **"Deploy"** button.

Vercel will:
1. Download your code from GitHub
2. Run `npm run build`
3. Publish your website

Wait about 1-2 minutes. When done, you'll see:

```
🎉 Congratulations!
Your deployment is live at: https://storysphere-abc123.vercel.app
```

**Copy and save your Vercel URL** 📝 — you'll need it in the next step.

---

---

# STEP 4 — Connect Frontend & Backend

We need to tell your backend to allow requests from your Vercel website.

---

### 4.1 — Update FRONTEND_URL on Railway

1. Go back to [railway.app](https://railway.app)
2. Click your **backend service**
3. Go to **"Variables"** tab
4. Find `FRONTEND_URL` → click the pencil icon to edit
5. Change its value to your Vercel URL:
   ```
   https://storysphere-abc123.vercel.app
   ```
6. Press **Enter** to save — Railway will auto-redeploy

---

### 4.2 — Redeploy Frontend (to Apply Final URLs)

In Vercel dashboard:
1. Click your **storysphere** project
2. Go to **"Deployments"** tab
3. Click the **"..."** on the latest deployment → **"Redeploy"**

Wait 1-2 minutes for it to finish.

---

---

# STEP 5 — Test Your Live App

Open your Vercel URL in a browser and test everything:

| Test | What to do | Expected result |
|------|------------|-----------------|
| **Auth gate** | Visit the URL without logging in | Redirected to Login page ✅ |
| **Register** | Create a new account | Account created, logged in ✅ |
| **Browse books** | Go to Home page | Books are displayed ✅ |
| **Read a book** | Click on a book | Book detail page opens ✅ |
| **Writer mode** | Register with Writer role | Writer Dashboard accessible ✅ |
| **Add chapters** | Click Chapters on a book | Chapter editor works ✅ |

---

---

# 🔧 Common Problems & Fixes

### ❌ "CORS Error" in browser console

**Cause:** Your frontend URL doesn't match what Railway allows.

**Fix:**
1. Go to Railway → backend service → Variables
2. Make sure `FRONTEND_URL` = your exact Vercel URL (no trailing slash)
3. Save → wait for redeploy → test again

---

### ❌ "Network Error" or "Failed to fetch" when logging in

**Cause:** `VITE_API_URL` in Vercel is wrong.

**Fix:**
1. Go to Vercel → your project → Settings → Environment Variables
2. Check that `VITE_API_URL` is:
   ```
   https://YOUR-RAILWAY-URL.up.railway.app/api
   ```
3. Delete and re-add if wrong → then Redeploy

---

### ❌ Backend crashes / "Application Error"

**Fix:**
1. Go to Railway → your backend service → **"Logs"** tab
2. Read the error message at the bottom
3. Most common cause: missing environment variable. Double-check Step 2.4.

---

### ❌ Database tables don't exist / "Table not found" error

**Fix:** Repeat Step 2.5 — run the schema.sql again in the MySQL Terminal.

---

---

# 🔄 How to Update Your App Later

Every time you make changes to your code:

```bash
# Save your changes and push to GitHub
git add .
git commit -m "description of what you changed"
git push
```

**That's it!** Both Railway and Vercel will automatically detect the push and redeploy within 1-2 minutes. No manual steps needed.

---

---

# 💰 Cost Summary

| Service | Free Plan | Limits |
|---------|-----------|--------|
| **Vercel** | Free forever | 100GB bandwidth/month |
| **Railway** | $5/month credit (renews monthly) | ~500 hours of compute |
| **Total** | **$0/month** | Handles hundreds of users |

**Credit card required?** ❌ No  
**Free tier expires?** ❌ Never (Railway credit renews every month)

---

---

# 📋 Quick Reference

### Your Live URLs (fill in after deployment):
```
Frontend:  https://_________________________.vercel.app
Backend:   https://_________________________.up.railway.app
```

### Re-deploy commands (if you prefer CLI):
```bash
# Backend
cd backend
npx @railway/cli up

# Frontend
cd frontend
vercel --prod
```

---

*Guide written for StorySphere — February 2026*  
*Free hosting | No credit card | Auto-deploy from GitHub*
