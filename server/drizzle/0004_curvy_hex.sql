CREATE TABLE IF NOT EXISTS "images" (
	"image_id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "images_image_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"post_id" integer NOT NULL,
	"image_url" varchar NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "images" ADD CONSTRAINT "images_post_id_posts_postId_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("postId") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
