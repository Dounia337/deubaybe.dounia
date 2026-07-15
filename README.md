# Dounia — Personal Portfolio Platform

A dynamic personal portfolio with a built-in admin panel (CMS). Everything on the
public site — projects, cyber lab entries, experiences, reflections, and the CV —
is stored in a database and managed from `/admin`, not hardcoded in the frontend.

## Tech stack

| Layer      | Choice                                                        |
|------------|----------------------------------------------------------------|
| Frontend   | Next.js 16 (App Router, React 19, TypeScript)                  |
| Styling    | Tailwind CSS v4, `next-themes` for light/dark mode              |
| Animation  | Framer Motion (hero terminal typing effect, live status ticker) |
| Database   | SQLite via `better-sqlite3` (see note below)                   |
| Auth       | JWT sessions (`jose`) in an HTTP-only cookie, bcrypt password hashing |
| PDF        | `@react-pdf/renderer`, generated live from the CV data in the database |
| Email      | Optional, via `nodemailer` (only runs if SMTP env vars are set) |

### Why SQLite instead of Postgres

The brief asked for PostgreSQL. This was built and tested in a sandboxed
environment with no network access to Prisma's binary CDN or a Postgres
server, so it uses `better-sqlite3` (a zero-config, file-based database)
instead — everything runs with `npm install && npm run dev`, no external
database to provision.

The whole app talks to the database through one file, `src/db/repo.ts`, so
moving to Postgres later is a matter of swapping that file's internals (e.g.
for [Drizzle ORM](https://orm.drizzle.team/) with `pg` or Prisma with a
`postgresql` datasource) — no page or API route needs to change, since they
all import from `@/db/repo` rather than talking to SQLite directly.

## Getting started

```bash
npm install
cp .env.example .env
# edit .env — at minimum set JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
npm run seed   # creates your admin user + sample content
npm run dev    # http://localhost:3000
```

Log in at `/admin/login` with the `ADMIN_EMAIL` / `ADMIN_PASSWORD` you set.
The seed script is safe to re-run — it skips anything that already exists.

**A database file already exists** in `data/portfolio.db` with sample content
and one admin user (`admin@example.com` / `ChangeMe123!`) so you can explore
immediately. Delete that file (or the whole `data/` folder) before running
`npm run seed` again if you want to start from a clean slate with your own
`.env` credentials.

## Project structure

```
src/
  app/
    (public)/            # public-facing site, wrapped in shared header/footer
      page.tsx            # home
      projects/           # list + [slug] detail
      cybersecurity/       # list + [slug] detail
      experiences/         # timeline
      reflections/         # list + [slug] detail
      cv/                   # interactive web CV + "Download PDF"
      contact/               # contact form
    admin/
      (auth)/login/         # login screen, no sidebar
      (dashboard)/           # everything behind auth, has the sidebar shell
        page.tsx               # stats overview
        projects/ cyber/ experiences/ reflections/  # list + new/[id] forms
        cv/                     # profile + education/experience/skills/leadership editor
        messages/               # contact form submissions, read/unread, delete
    api/                    # REST-ish route handlers backing all of the above
  components/               # shared UI (ui/primitives.tsx) + admin/ + page-specific
  db/
    schema.sql               # full SQLite schema
    index.ts                  # connection singleton, runs schema.sql on startup
    repo.ts                    # typed data-access layer — the only place SQL lives
  lib/
    auth.ts                   # password hashing + JWT sign/verify
    session.ts                  # server-side session helpers (getSession/requireAdmin)
    api-helpers.ts               # consistent error → HTTP response mapping
    mailer.ts                     # optional contact-notification email
  middleware.ts               # protects /admin/* pages and non-GET /api/* routes
scripts/seed.ts               # admin user + realistic sample content
```

## Security

- Passwords hashed with **bcrypt** (12 rounds), never stored or logged in plaintext.
- Sessions are **JWTs in an HTTP-only, SameSite=Lax cookie** — not readable from
  client-side JavaScript, so they aren't a target for XSS-based token theft.
- `src/middleware.ts` blocks every `/admin/*` page and every non-`GET` `/api/*`
  request unless a valid session cookie is present, independent of any
  page-level checks — this is the actual enforcement boundary, not just a UI guard.
- All request bodies are validated with **Zod** schemas before touching the
  database (`src/app/api/**/route.ts`) — this is what prevents malformed or
  malicious input, not just TypeScript types.
- All database access goes through parameterized `better-sqlite3` statements
  (see `src/db/repo.ts`) — no string-concatenated SQL, which is what prevents
  SQL injection.
- React escapes all rendered text by default, which is the main XSS defense
  for user-generated content (reflections, messages, etc.).
- The contact form has a hidden honeypot field to filter basic bots, and
  server-side Zod validation regardless of what the client sends.
- Set `JWT_SECRET` to a long random value in production
  (`openssl rand -base64 48`) — the fallback in `src/lib/auth.ts` is only for
  local development and will refuse to be a surprise: change it in `.env`.

## Deploying

This app calls native Node APIs (`better-sqlite3`, `bcryptjs`, `@react-pdf/renderer`)
so it needs a **Node.js server runtime**, not a purely static or edge-only host.
Platforms like Render, Railway, Fly.io, or a plain VPS work well. On most of
these, mount a persistent volume at `data/` so `portfolio.db` survives
restarts and deploys — without it, every redeploy starts from an empty database.

```bash
npm run build
npm run start
```

## Extending

- **Images**: project/experience `image_url` fields are plain URLs today
  (paste a link from any image host). Wiring up direct upload would mean
  adding a storage provider (S3, Cloudinary, etc.) and an upload API route —
  intentionally left out here to avoid depending on a third-party service
  the account owner hasn't chosen yet.
- **Email notifications**: set `SMTP_HOST` and `NOTIFY_EMAIL` in `.env` to get
  an email whenever the contact form is submitted (see `.env.example`). Contact
  messages are always saved to the database and visible in `/admin/messages`
  regardless of whether email is configured.
- **Changing the admin password**: there's no in-app "change password" screen
  yet. For now, generate a new bcrypt hash and update the `admin_users` table
  directly, or delete `data/portfolio.db` and re-run `npm run seed` with new
  `.env` values.
