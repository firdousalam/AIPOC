# Free Deployment Guide – Enterprise Sales AI

This guide covers **free-tier** options to deploy the frontend, API, ML service, and database. All suggested platforms have generous free tiers suitable for demos and small teams.

---

## Recommended free stack

| Component      | Platform        | Free tier notes                          |
|---------------|-----------------|------------------------------------------|
| **Frontend**  | Vercel          | Unlimited static/SSR, 100GB bandwidth   |
| **API**       | Render or Railway | 750 hrs/month (Render) or $5 credit (Railway) |
| **ML Service**| Render or Railway | Same as API                          |
| **Database**  | MongoDB Atlas   | Free M0 cluster (512MB)                   |

**Total cost: $0/month** (within free limits).

---

## 1. MongoDB Atlas (database) – do this first

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) and sign up.
2. Create a **free M0 cluster** (e.g. AWS, region closest to you).
3. Create a database user (Database Access → Add New User).
4. Network Access → Add IP Address → **Allow Access from Anywhere** (`0.0.0.0/0`) for cloud hosting.
5. Clusters → **Connect** → **Drivers** → copy the connection string.
6. Replace `<password>` with your user password. Example:
   ```txt
   mongodb+srv://user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/enterprise-sales-ai?retryWrites=true&w=majority
   ```
   Save this as `MONGODB_URI`; you’ll use it for the API.

---

## 2. Frontend – Vercel (Next.js)

1. Push your repo to **GitHub** (or GitLab/Bitbucket).
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub.
3. **Add New Project** → import your repo.
4. Configure:
   - **Framework Preset:** Next.js
   - **Root Directory:** `apps/web`
   - **Install Command:** `cd ../.. && pnpm install` (installs full monorepo)
   - **Build Command:** `cd ../.. && pnpm --filter web build` (builds only the web app)
   - **Output Directory:** leave default (`.next`)

5. **Environment variables** (Vercel → Project → Settings → Environment Variables):

   | Name                      | Value                          |
   |---------------------------|--------------------------------|
   | `NEXT_PUBLIC_API_URL`     | `https://your-api.onrender.com` or your API URL |
   | `NEXT_PUBLIC_ML_SERVICE_URL` | `https://your-ml.onrender.com` or your ML URL   |

6. Deploy. Your frontend will be at `https://your-project.vercel.app`.

---

## 3. API – Render (NestJS)

1. Go to [render.com](https://render.com) and sign in with GitHub.
2. **New +** → **Web Service**.
3. Connect your repo.
4. Configure:
   - **Name:** e.g. `sales-ai-api`
   - **Region:** e.g. Oregon (US West)
   - **Root Directory:** `apps/api`
   - **Runtime:** Node
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm run start:prod`
   - **Plan:** Free

5. **Environment variables** (Render dashboard → Environment):

   | Key             | Value                    |
   |-----------------|--------------------------|
   | `NODE_ENV`      | `production`             |
   | `MONGODB_URI`   | Your Atlas connection string |
   | `JWT_SECRET`    | Long random string (e.g. 32+ chars) |
   | `FRONTEND_URL`  | `https://your-app.vercel.app` |
   | `CORS_ORIGINS`  | `https://your-app.vercel.app` |
   | `ML_SERVICE_URL`| `https://your-ml.onrender.com` (after ML is deployed) |

6. Create Web Service. Note the URL (e.g. `https://sales-ai-api.onrender.com`).  
   **Free tier:** service sleeps after ~15 min inactivity; first request may take 30–60 s to wake.

---

## 4. ML Service – Render (FastAPI)

1. **New +** → **Web Service**.
2. Same repo, different service:
   - **Root Directory:** `apps/ml-service`
   - **Runtime:** Python
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Plan:** Free

3. **Environment variables:**

   | Key            | Value                          |
   |----------------|--------------------------------|
   | `CORS_ORIGINS`| `https://your-app.vercel.app,https://your-api.onrender.com` |

4. Create Web Service. Note the URL (e.g. `https://sales-ai-ml.onrender.com`).

**Tip:** If the build times out (e.g. due to `tensorflow`), you can temporarily remove or replace heavy packages in `requirements.txt` for the free tier.

---

## 5. Alternative: Railway (API + ML)

Railway gives **$5 free credit per month** and is often faster to wake than Render.

1. Go to [railway.app](https://railway.app) and sign in with GitHub.
2. **New Project** → **Deploy from GitHub repo** → select your repo.
3. Add **two services** from the same repo:
   - **Service 1 – API**
     - Root Directory: `apps/api`
     - Variables: `MONGODB_URI`, `JWT_SECRET`, `FRONTEND_URL`, `CORS_ORIGINS`, `ML_SERVICE_URL`
     - Start: `npm run start:prod` (or use `railway.toml` in `apps/api`)
   - **Service 2 – ML**
     - Root Directory: `apps/ml-service`
     - Variables: `CORS_ORIGINS`
     - Start: `uvicorn main:app --host 0.0.0.0 --port $PORT`

4. Generate domains in Railway for each service and use those URLs in Vercel env vars.

---

## 6. Optional: Deploy with Render Blueprint

If you prefer one-click setup:

1. In Render: **New +** → **Blueprint**.
2. Connect the repo that contains `render.yaml` at the **repository root**.
3. Render will create the two web services (API + ML). Set **Root Directory** to `apps/api` and `apps/ml-service` if not already set by the blueprint.
4. Add **Environment** variables (especially `MONGODB_URI`, `JWT_SECRET`, `FRONTEND_URL`, `CORS_ORIGINS`, `ML_SERVICE_URL`) in the Render dashboard for each service.

---

## 7. Wire everything together

1. **MongoDB Atlas:** Already set; API uses `MONGODB_URI`.
2. **API:** Knows frontend via `FRONTEND_URL` / `CORS_ORIGINS`, and ML via `ML_SERVICE_URL`.
3. **ML service:** Allows frontend and API via `CORS_ORIGINS`.
4. **Vercel:** `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_ML_SERVICE_URL` point to your Render (or Railway) API and ML URLs.

After deployment:

- **Frontend:** `https://your-project.vercel.app`
- **API:** `https://sales-ai-api.onrender.com/api` (or your Railway API URL)
- **ML:** `https://sales-ai-ml.onrender.com/docs` (or your Railway ML URL)

---

## 8. Other free options (short list)

- **Frontend:** Netlify, Cloudflare Pages (both support Next.js with some config).
- **API / ML:** Fly.io (free allowance), Koyeb (free tier), Google Cloud Run (free tier limits).
- **Database:** Keep using MongoDB Atlas M0; no need to change for these.

---

## 9. Checklist before go-live

- [ ] MongoDB Atlas: user created, IP allowlist includes `0.0.0.0/0`, connection string in API env.
- [ ] API: `MONGODB_URI`, `JWT_SECRET`, `FRONTEND_URL` / `CORS_ORIGINS`, `ML_SERVICE_URL` set.
- [ ] ML: `CORS_ORIGINS` includes your Vercel (and optionally API) URL.
- [ ] Vercel: `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_ML_SERVICE_URL` point to deployed API and ML.
- [ ] No secrets in repo; all secrets only in platform env vars.

Once this is done, your application is ready for free deployment end-to-end.
