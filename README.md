# NutriFit Sponsor Backend

This backend is designed to sit beside the GitHub Pages frontend.

## 1. Supabase
Create a Supabase project, open SQL Editor, and run `schema.sql`.
Create a **public** Storage bucket named `sponsor-images`.

Get:
- Project URL
- anon/public key
- service_role key (server only)

## 2. Vercel
Deploy this folder as a Vercel project.

Add these environment variables in Vercel Project Settings → Environment Variables:
- SUPABASE_URL
- SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET

Never put `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY` or `STRIPE_WEBHOOK_SECRET` in the GitHub Pages frontend.

## 3. Stripe
Create a webhook endpoint:
`https://YOUR-VERCEL-DOMAIN/api/stripe/webhook`

Listen for:
`checkout.session.completed`

The frontend appends `client_reference_id=nf_<sponsor-id>` to the existing Stripe Payment Link. Stripe sends that reference in the `checkout.session.completed` event.

## 4. Frontend
After Vercel is deployed, set the backend URL in NutriFit:
`https://YOUR-VERCEL-DOMAIN`

The frontend then creates a pending sponsor before sending the customer to Stripe. The webhook activates it only after Stripe confirms payment.

## 5. Important
The public sponsor list only returns active sponsors whose expiry time is still in the future.
A scheduled cleanup is not strictly required for display because expired records are filtered out automatically. A later cleanup job can archive/delete old records.

## NutriFit V37 — Supabase project connected

The frontend is preconfigured with the Supabase project URL and its **publishable** browser key. It reads the existing `public.Sponsor` table through the Supabase Data API using RLS.

Do not add a `service_role`/secret key to the frontend. The backend still requires `SUPABASE_SERVICE_ROLE_KEY` in its deployment environment for server-side sponsor creation and Stripe webhooks.
