**Code change**

In `src/lib/predictions.functions.ts`, delete the mirror-write block (lines that read `EXTERNAL_SUPABASE_URL` / `EXTERNAL_SUPABASE_SERVICE_ROLE_KEY` and POST to `${extUrl}/rest/v1/predictions`). The handler will end at `return { success: true as const }` right after the successful insert. No other logic changes.

**Service role key**

I cannot read secret values — only names. To get the `SUPABASE_SERVICE_ROLE_KEY` for your Cloudflare Worker: in Lovable, open **Cloud → View Backend** (opens the database dashboard) → **Settings (gear icon) → API Keys** → reveal and copy the `service_role` key. Then add it as a secret in Cloudflare → Worker → Settings → Variables and Secrets, alongside `SUPABASE_URL` (`https://oeeumwcjpzvqevvdakgu.supabase.co`) and `SUPABASE_PUBLISHABLE_KEY`. Redeploy the Worker.