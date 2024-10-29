import {
  integer,
  pgTable,
  varchar,
  timestamp as pgTimestamp,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  username: varchar({ length: 255 }).unique().notNull(),
  email: varchar({ length: 255 }).unique().notNull(),
  createdAt: pgTimestamp("created_at").notNull(),
});
