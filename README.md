# Spark website

Next.js website for Spark Engineering & Contracting, configured for Cloudflare Workers with the OpenNext adapter and D1.

## Cloudflare setup

1. Install packages with `npm install`.
2. Create a D1 database: `npx wrangler d1 create spark-site`.
3. Copy the returned database ID into `database_id` in `wrangler.jsonc`. The checked-in UUID is only a local-development placeholder; replace it before applying remote migrations or deploying.
4. Images use D1; no R2 bucket is required.
5. Apply the schema and initial project records: `npx wrangler d1 migrations apply spark-site --remote`.
6. Set production secrets (use a long unique password and a separate random session secret): `npx wrangler secret put SPARK_ADMIN_PASSWORD` and `npx wrangler secret put SPARK_SESSION_SECRET`.
7. For local work, copy `.dev.vars.example` to `.dev.vars` and replace both values. Apply a local copy of the migration with `npx wrangler d1 migrations apply spark-site --local`.
8. Preview in the Cloudflare Workers runtime with `npm run preview`; deploy with `npm run deploy`.

The private console is at `/ar/admin` (or `/en/admin`) and requires the `SPARK_ADMIN_PASSWORD`. The URL is intentionally unlinked and excluded from search indexing; the password and signed, HTTP-only browser-session cookie provide access control. The login form is centered on mobile and desktop.

## Projects and analytics

Project metadata is stored in D1, and uploaded image files are stored in the `spark-site-images` R2 bucket. The first migration seeds the three existing projects. From the console, upload a JPG, PNG, WEBP, or AVIF image (up to 5 MB) with each new project. The bucket stays private; the app serves stored images through `/api/uploads/...` and saves that path with the project metadata in D1. Wrangler uses a local R2 emulator during local development.

The analytics tracker records public page views with a persistent anonymous browser ID and refreshes an active-session heartbeat every 10 seconds while a public page is visible. Console statistics count distinct browser IDs in each time period, so refreshing or opening another page does not count the same browser as a new visitor. Admin sessions and the console are excluded. The console polls active sessions and visitor totals every 15 seconds while visible. Static assets and API calls are not counted.

## Local development

Run `npm run dev` for Next.js development. `npm run lint` checks source formatting and common issues.
