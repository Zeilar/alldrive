// eslint-disable-next-line @nx/enforce-module-boundaries
import { EXTERNAL_ID_LENGTH } from "../../../../../../libs/config/src/lib/config";
import { pgTable, char, bigint, uuid } from "drizzle-orm/pg-core";

export const files = pgTable("files", {
  id: uuid("id").primaryKey().defaultRandom(),
  externalId: char("externalId", { length: EXTERNAL_ID_LENGTH })
    .notNull()
    .unique(),
  password: char("password", { length: 70 }),
  size: bigint("size", { mode: "number" }).notNull(), // In bytes
  expires: bigint("expires", { mode: "number" }).notNull(), // UNIX timestamp
});

export const schema = { files };
