import { integer, pgTable, primaryKey } from "drizzle-orm/pg-core";
import { postsTable } from "./posts";
import { roomsTable } from "./rooms";

export const postRoomsTable = pgTable(
  "post_rooms",
  {
    postId: integer("post_id").references(() => postsTable.postId),
    roomId: integer("room_id").references(() => roomsTable.roomId),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.postId, table.roomId] }),
    };
  }
);
