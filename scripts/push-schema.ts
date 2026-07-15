import "dotenv/config";
import { sql } from "../src/db";
import { applySchema } from "../src/db/migrate";

applySchema()
  .then(() => {
    console.log("Schema applied.");
    return sql.end();
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
