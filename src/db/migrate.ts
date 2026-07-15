import fs from "fs";
import path from "path";
import { sql } from "./index";

// Applies schema.sql (every statement is CREATE TABLE IF NOT EXISTS, so this
// is idempotent). Run explicitly via `npm run seed` or `npm run db:push` —
// not on every app boot — since the schema only needs to exist once against
// the shared hosted database, not per serverless invocation.
export async function applySchema(): Promise<void> {
  const schemaPath = path.join(process.cwd(), "src", "db", "schema.sql");
  const schema = fs.readFileSync(schemaPath, "utf-8");
  await sql.unsafe(schema);
}
