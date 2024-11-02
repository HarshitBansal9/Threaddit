import { integer, pgTable, varchar } from "drizzle-orm/pg-core";
import { postsTable } from "./posts";

export const imagesTable = pgTable("images", {
    imageId: integer("image_id").primaryKey().generatedAlwaysAsIdentity(),
    postId: integer("post_id")
        .notNull()
        .references(() => postsTable.postId, { onDelete: "cascade" }),
    imageUrl: varchar("image_url").notNull(),
});
