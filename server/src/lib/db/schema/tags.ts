import {
  integer,
  pgTable,
  varchar,
  timestamp as pgTimestamp,
} from "drizzle-orm/pg-core";
import { postsTable } from "./posts";

export const tagsTable = pgTable("tags", {
  tagId: integer("tag_id").primaryKey().generatedAlwaysAsIdentity(),
  tagName: varchar("tag_name", { length: 255 }).unique().notNull(),
  postId: integer("post_id")
    .notNull()
    .references(() => postsTable.postId, { onDelete: "cascade" }),
});
