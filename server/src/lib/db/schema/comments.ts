import {
  integer,
  pgTable,
  varchar,
  timestamp as pgTimestamp,
} from "drizzle-orm/pg-core";
import { postsTable } from "./posts";
import { users } from "./users";

export const commentsTable = pgTable("comments", {
  commentId: integer("comment_id").primaryKey().generatedAlwaysAsIdentity(),
  commentBody: varchar("comment_body", { length: 255 }).notNull(),
  createdAt: pgTimestamp("created_at").notNull(),
  postId: integer("post_id")
    .notNull()
    .references(() => postsTable.postId, { onDelete: "cascade" }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});
