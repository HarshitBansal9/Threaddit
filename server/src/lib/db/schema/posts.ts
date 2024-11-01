import {
    integer,
    pgTable,
    timestamp as pgTimestamp,
    varchar,
    boolean,
} from "drizzle-orm/pg-core";
import { users } from "./users";

import { desc } from "drizzle-orm";

export const postsTable = pgTable("posts", {
    postId: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: integer("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    title: varchar({ length: 255 }).notNull(),
    description: varchar({ length: 255 }).notNull(),
    createdAt: pgTimestamp("created_at").notNull(),
    isPublic: boolean().notNull().default(false),
    commentsEnabled: boolean().notNull().default(true),
});
