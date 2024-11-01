import db from "@/lib/db";
import { commentsTable } from "@/lib/db/schema/comments";
import { likesTable } from "@/lib/db/schema/likes";
import { postRoomsTable } from "@/lib/db/schema/postRooms";
import { postsTable } from "@/lib/db/schema/posts";
import { users } from "@/lib/db/schema/users";
import { and, eq } from "drizzle-orm";

interface Post {
    postId?: number;
    userId: number;
    title: string;
    description: string;
    createdAt: Date;
    isPublic: boolean;
    commentsEnabled: boolean;
}
interface PostRoom {
    postId?: number;
    roomId: number;
}
interface Comment {
    commentId?: number;
    commentBody: string;
    createdAt: Date;
    postId: number;
    userId: number;
}

interface Like {
    likeId?: number;
    createdAt: Date;
    postId: number;
    userId: number;
}

export class PostController {
    static CreatePost = async (
        user: any,
        body: { post: Post; roomId: number }
    ) => {
        try {
            const post = await db
                .insert(postsTable)
                .values(body.post)
                .returning({ postId: postsTable.postId });
            const postRoom: PostRoom = {
                postId: post[0].postId,
                roomId: body.roomId,
            };
            const postRoomsReturned = await db
                .insert(postRoomsTable)
                .values(postRoom)
                .returning();
        } catch (error) {
            console.error("Error while creating post");
        }
    };

    static GetPrivatePosts = async (user: any, body: {}) => {
        try {
            const email = user?.email;
            const privatePosts = await db
                .select()
                .from(postsTable)
                .innerJoin(
                    postRoomsTable,
                    eq(postsTable.postId, postRoomsTable.postId)
                )
                .innerJoin(users, eq(users.id, postsTable.userId))
                .where(
                    and(eq(postsTable.isPublic, false), eq(users.email, email))
                )
                .execute();
            return privatePosts;
        } catch (error) {
            console.error("Error while fetching private posts");
        }
    };

    static GetPublicPosts = async () => {
        try {
            const publicPosts = await db
                .select()
                .from(postsTable)
                .innerJoin(
                    postRoomsTable,
                    eq(postsTable.postId, postRoomsTable.postId)
                )
                .innerJoin(users, eq(users.id, postsTable.userId))
                .where(eq(postsTable.isPublic, true))
                .execute();

            return publicPosts;
        } catch (error) {
            console.error("Error while fetching public posts");
        }
    };

    static GetPostComments = async (user: any, body: { postId: number }) => {
        const email = user?.email;
        try {
            const comments = await db
                .select()
                .from(commentsTable)
                .innerJoin(users, eq(users.id, commentsTable.userId))
                .where(eq(commentsTable.postId, body.postId))
                .execute();
            return comments;
        } catch (error) {
            console.error("Error while fetching comments");
        }
    };

    static CreatePostComment = async (
        user: any,
        body: { comment: Comment }
    ) => {
        try {
            await db.insert(commentsTable).values(body.comment);
        } catch (error) {
            console.error("Error while creating a comment");
        }
    };

    static getPostLikes = async (user: any, body: { postId: number }) => {
        const email = user?.email;

        try {
            const likes = await db
                .select()
                .from(likesTable)
                .innerJoin(users, eq(users.id, likesTable.userId))
                .where(eq(likesTable.postId, body.postId))
                .execute();

            return likes;
        } catch (error) {
            console.error("error while getting likes");
        }
    };

    
    static CreatePostLike = async (user: any, body: { like: Like }) => {
        try {
            await db.insert(likesTable).values(body.like);
        } catch (error) {
            console.error("Error while creating a comment");
        }
    };
}
