# Telo — read the whole Bible in 9 months

Most people who set out to read the Bible cover to cover stop somewhere in
Leviticus. Not because they lose interest, but because "read the Bible" is not a
task you can start today — there is no clear next action, and no way to tell
whether you are behind.

Telo turns it into a schedule. The full text is divided across nine months, so
every day has a defined portion: finite, visible, and finishable in one sitting.
Open the app and you are told exactly what to read today.

## What it does

- **Today** — the day's reading, ready to open with no decisions to make
- **Journey** — the nine-month plan, showing where you are against where you
  should be
- **Progress** — what you have completed so far
- **Bible** — browse the full text outside the plan
- **Explore** — discovery beyond the day's portion
- **Push reminders** — a daily nudge, since the plan only works if you open it
- **Accounts and onboarding** — progress is saved to your account, not the
  browser, so it survives a new phone
- **Pro tier** — additional features above the free plan

## Stack

| | |
|---|---|
| Framework | Next.js (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Auth + database | Supabase (`@supabase/ssr`) |
| Notifications | Web Push |
| Hosting | Vercel |

## Structure

```
web/
  app/
    (app)/          hoje · leitura · biblia · progresso · jornada
                    explorar · perfil · configuracoes
    (auth)/         sign-in and registration
    onboarding/     first-run plan setup
    pro/            paid tier
    api/bible/      Bible text API
  components/
  lib/
supabase-onboarding.sql   database schema
```

## Roadmap

Planned but not yet built:

- Audio narration of each day's reading
- Curated video for the passage being read that day
- A home screen carrying a daily quote

## Running locally

```bash
cd web
npm install
npm run dev
```

Requires a Supabase project. Copy the environment variables into `web/.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

The service role key is server-side only and must never reach the browser.

---

Built by [Isaque Couto](https://github.com/IsaqueCouto).
