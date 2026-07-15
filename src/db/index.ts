import postgres from "postgres";

// A single shared Postgres connection for the whole app, cached across
// dev hot-reloads. Schema is NOT applied here — see migrate.ts — so that
// this module stays a plain synchronous import usable from both the
// Next.js app and standalone scripts (tsx/esbuild can't transpile
// top-level await to CommonJS).
declare global {
  var __portfolioSql: ReturnType<typeof postgres> | undefined;
}

function createConnection() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set.");
  }
  // Neon's connection string is pooled (PgBouncer-style): the same logical connection can be
  // routed to different physical backends between queries, so server-side prepared statements
  // (postgres.js's default) can end up reused against a backend with a stale plan — surfacing as
  // "cached plan must not change result type" any time a table's shape changes. Disabling
  // server-side prepare avoids this class of bug entirely; the perf cost is negligible here.
  return postgres(connectionString, { ssl: "require", prepare: false });
}

export const sql = global.__portfolioSql ?? createConnection();
if (process.env.NODE_ENV !== "production") {
  global.__portfolioSql = sql;
}
