import {
  integer,
  pgTable,
  varchar,
  timestamp as pgTimestamp,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const roomsTable = pgTable("rooms", {
  roomId: integer("room_id").primaryKey().generatedAlwaysAsIdentity(),
  roomName: varchar("room_name", { length: 255 }).unique().notNull(),
  createdAt: pgTimestamp("created_at").notNull(),
  createdBy: integer("created_by")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});
