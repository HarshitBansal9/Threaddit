import {
    integer,
    pgTable,
    timestamp as pgTimestamp,
} from "drizzle-orm/pg-core";
import { postsTable } from "./posts";
import { users } from "./users";

export const likesTable = pgTable("likes", {
    likeId: integer("like_id").primaryKey().generatedAlwaysAsIdentity(),
    createdAt: pgTimestamp("created_at").notNull(),
    postId: integer("post_id")
        .notNull()
        .references(() => postsTable.postId, { onDelete: "cascade" }),
    userId: integer("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
});
