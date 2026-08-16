# AuraEvent — Deployment Runbook

This is the exact sequence to go from this folder to a live HTTPS URL.

## 0. Local build sanity check (do this first)

```bash
npm install
npm run build
```

If this fails, fix the reported error before continuing — don't deploy a broken build. `npm run preview`
will let you click through the production build locally at `http://localhost:4173` before pushing anywhere
(this local URL is fine for your own testing — it is not the deliverable).

## 1. Push to GitHub

```bash
git init
git add .
git status        # confirm no .env, keys, or secrets are staged — only .env.example should appear
git commit -m "Initial commit: AuraEvent"
```

Then on github.com: **New repository** → name it `aura-event` → do NOT initialize with a README (you already
have one) → create.

```bash
git remote add origin https://github.com/projecttgppp001-cmd/aura-event.git
git branch -M main
git push -u origin main
```

## 2. Deploy to Vercel

1. Go to vercel.com → **Add New Project** → **Import** your `aura-event` GitHub repo.
2. Framework Preset: **Vite** (should auto-detect).
3. Build Command: `npm run build` — Output Directory: `dist` — Install Command: `npm install` (all auto-filled
   by the Vite preset; verify they match).
4. Under **Environment Variables**, add (only if you're using Supabase — otherwise skip, the app runs in
   Local Mock Mode):
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=<your anon key>
   ```
5. Click **Deploy**. Vercel gives you a URL like `https://aura-event-xxxx.vercel.app`.
6. `vercel.json` (already in this repo) rewrites all paths to `index.html`, so direct loads of `/docs`,
   `/admin`, `/student/events` etc. will work instead of 404ing — no extra Vercel dashboard config needed
   for this part.

## 3. Supabase setup (only if you want live PostgreSQL instead of Local Mock Mode)

1. Create a project at supabase.com.
2. SQL Editor → New Query → paste the full contents of `supabase_schema.sql` from this repo → **Run**.
3. Sign up once with `projecttgppp001@gmail.com`, then promote that account from the SQL Editor:
   ```sql
   update public.profiles
   set role = 'admin'
   where email = 'projecttgppp001@gmail.com';
   ```
4. Project Settings → API → copy the **Project URL** and **anon public** key (never the `service_role` key)
   into the Vercel environment variables from step 2.4, then redeploy (Vercel → Deployments → ⋯ → Redeploy).
5. Authentication → URL Configuration → set **Site URL** to your Vercel URL, and add it to **Redirect URLs**
   too, so auth flows resolve to production instead of localhost.

## 4. Verify the live site

Open your actual Vercel URL (not localhost) and check:

- [ ] `/` loads
- [ ] `/docs` loads directly when pasted into a new browser tab (tests the SPA rewrite)
- [ ] Register a new student account, or log in with a demo account
- [ ] Browse/search/filter events, register for one, see the QR pass under **My Tickets**
- [ ] Try registering twice for the same event → blocked
- [ ] Log in with the production admin account, reach `/admin/dashboard`
- [ ] Log out, then try typing `/admin/dashboard` directly in the URL bar → redirected, not shown
- [ ] Create/edit an event, view participants, export CSV, publish an announcement
- [ ] Check the page on a phone-width browser window

## 5. Update the README

Once deployed, replace the two placeholders in `README.md`:

```text
Live Demo: [DEPLOYED URL]        →  Live Demo: https://your-actual-url.vercel.app
Repository: https://github.com/projecttgppp001-cmd/aura-event
```

Commit and push that change too.
