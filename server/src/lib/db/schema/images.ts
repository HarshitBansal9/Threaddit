import { integer, pgTable, varchar } from "drizzle-orm/pg-core";
import { postsTable } from "./posts";

export const imagesTable = pgTable("images", {
  imageId: integer().primaryKey().generatedAlwaysAsIdentity(),
  postId: integer("post_id")
    .notNull()
    .references(() => postsTable.postId, { onDelete: "cascade" }),
  imageUrl: varchar({ length: 255 }).notNull(),
});
