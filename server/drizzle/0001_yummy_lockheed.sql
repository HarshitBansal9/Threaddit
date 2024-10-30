CREATE TABLE IF NOT EXISTS "comments" (
	"comment_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "comments_comment_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"comment_body" varchar(255) NOT NULL,
	"created_at" timestamp NOT NULL,
	"post_id" integer NOT NULL,
	"user_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "images" (
	"imageId" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "images_imageId_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"post_id" integer NOT NULL,
	"imageUrl" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "members" (
	"room_id" integer,
	"user_id" integer,
	"is_admin" boolean DEFAULT false,
	CONSTRAINT "members_room_id_user_id_pk" PRIMARY KEY("room_id","user_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "post_rooms" (
	"post_id" integer,
	"room_id" integer,
	CONSTRAINT "post_rooms_post_id_room_id_pk" PRIMARY KEY("post_id","room_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "posts" (
	"postId" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "posts_postId_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"user_id" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" varchar(255) NOT NULL,
	"created_at" timestamp NOT NULL,
	"isPublic" boolean DEFAULT false NOT NULL,
	"commentsEnabled" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rooms" (
	"room_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "rooms_room_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"room_name" varchar(255) NOT NULL,
	"created_at" timestamp NOT NULL,
	"created_by" integer NOT NULL,
	CONSTRAINT "rooms_room_name_unique" UNIQUE("room_name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tags" (
	"tag_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "tags_tag_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"tag_name" varchar(255) NOT NULL,
	"created_at" timestamp NOT NULL,
	"post_id" integer NOT NULL,
	CONSTRAINT "tags_tag_name_unique" UNIQUE("tag_name")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comments" ADD CONSTRAINT "comments_post_id_posts_postId_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("postId") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "images" ADD CONSTRAINT "images_post_id_posts_postId_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("postId") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "members" ADD CONSTRAINT "members_room_id_rooms_room_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."rooms"("room_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "members" ADD CONSTRAINT "members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "post_rooms" ADD CONSTRAINT "post_rooms_post_id_posts_postId_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("postId") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "post_rooms" ADD CONSTRAINT "post_rooms_room_id_rooms_room_id_fk" FOREIGN KEY ("room_id") REFERENCES "public"."rooms"("room_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "posts" ADD CONSTRAINT "posts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rooms" ADD CONSTRAINT "rooms_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tags" ADD CONSTRAINT "tags_post_id_posts_postId_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("postId") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
