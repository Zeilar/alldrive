import { Config, defineConfig } from "drizzle-kit";
import { join } from "path";

const { DB_TYPE, DB_HOST, DB_NAME, DB_PASSWORD, DB_PORT, DB_USER } =
  process.env;
const parsedPort = parseInt(DB_PORT);

const baseConfig = { schema: join(__dirname, "./schema.ts") } as const;

const postgresConfig = defineConfig({
  ...baseConfig,
  out: join(__dirname, `./migrations/${DB_TYPE}`),
  dialect: "postgresql",
  dbCredentials: {
    database: DB_NAME,
    host: DB_HOST,
    password: DB_PASSWORD,
    port: parsedPort,
    user: DB_USER,
  },
});

function getConfig(): Config {
  switch (DB_TYPE as Config["dialect"]) {
    case "postgresql":
      return postgresConfig;
    default:
      throw new Error(`Unsupported DB_TYPE \`${JSON.stringify(DB_TYPE)}\``);
  }
}

export default getConfig();
