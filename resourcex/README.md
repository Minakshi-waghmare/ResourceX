# ResourceX
*Waste is a Resource. Find it. Match it. Exchange it.* — industrial waste & by-product exchange marketplace (React + Vite + TypeScript + Tailwind + React Router + Lucide + Supabase).

## Run locally
1. Install Node.js 18+.
2. `npm install`
3. `cp .env.example .env` (optional – leave blank for **demo mode**)
4. `npm run dev` → open http://localhost:5173

**Demo mode** (no Supabase keys): all data lives in browser localStorage. Log in with `demo@resourcex.in` / `demo1234`, or register a new industry.

## Supabase mode
1. Create a Supabase project; run `supabase/schema.sql` in the SQL editor (tables, RLS policies, `lab-documents` storage bucket).
2. Put `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env`. Enable Google/Azure providers in Auth settings for social login.
3. Optional: `VITE_GOOGLE_MAPS_API_KEY` (Maps Embed API) for the inline factory-location map.

Currently wired to Supabase: sign-up/login/password reset/OAuth, industry profile, sell listings, lab-document uploads. Buy requirements, requests, feedback, trades and notifications use the same screens but persist in localStorage; the tables and RLS for them already exist in `schema.sql`, so porting `src/contexts/AppContext.tsx` actions is the next step.

## Structure
`src/pages` screens · `src/components/ui.tsx` shared UI · `src/contexts` app state · `src/services` auth, supabase, seed data · `src/types` · `src/utils`.
Product photos from the designs are replaced by icon tiles (no image assets were provided).
