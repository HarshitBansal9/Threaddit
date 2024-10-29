import { boolean, integer, pgTable, primaryKey } from "drizzle-orm/pg-core";
import { roomsTable } from "./rooms";
import { users } from "./users";

export const membersTable = pgTable(
  "members",
  {
    roomId: integer("room_id").references(() => roomsTable.roomId),
    userId: integer("user_id").references(() => users.id),
    isAdmin: boolean("is_admin").default(false),
  },
  (table) => {
    return {
      pK: primaryKey({ columns: [table.roomId, table.userId] }),
    };
  }
);
