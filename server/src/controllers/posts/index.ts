import db from "@/lib/db";
import { commentsTable } from "@/lib/db/schema/comments";
import { imagesTable } from "@/lib/db/schema/images";
import { likesTable } from "@/lib/db/schema/likes";
import { postRoomsTable } from "@/lib/db/schema/postRooms";
import { postsTable } from "@/lib/db/schema/posts";
import { tagsTable } from "@/lib/db/schema/tags";
import { users } from "@/lib/db/schema/users";
import RedisClient from "@/lib/redis/redis";
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

interface Image {
    imageId?: number;
    postId: number;
    imageUrl: string;
}

interface Tag {
    tagId?: number;
    postId: number;
    tagName: string;
}

function alterPosts(p: any) {
    const postsAgg: { [key: string]: any } = {};
    const imagesAgg: { [key: string]: any } = {};
    const tagsAgg: { [key: string]: any } = {};
    const roomsAgg: { [key: string]: any } = {};

    console.log(p);

    p.forEach((postObj: any) => {
        //deconstructing the post object
        const { posts, images, tags, users, rooms } = postObj;

        //checking if the post is already in the postsAgg object and if not adding it
        if (posts && !postsAgg[posts.postId]) {
            postsAgg[posts.postId] = posts;
            postsAgg[posts.postId].imageUrls = [];
            postsAgg[posts.postId].tags = [];
            postsAgg[posts.postId]["userId"] = users?.id;
            postsAgg[posts.postId]["username"] = users?.username;
            postsAgg[posts.postId]["email"] = users?.email;
            postsAgg[posts.postId]["roomId"] = rooms?.roomId;
        }

        //checking if the images is already in the imagesAgg object and if not adding it
        if (images && !imagesAgg[images.imageId]) {
            imagesAgg[images.imageId] = images;
        }

        //checking if the tags is already in the tagsAgg object and if not adding it
        if (tags && !tagsAgg[tags.tagId]) {
            tagsAgg[tags.tagId] = tags;
        }
    });

    console.log({
        postsAgg,
        imagesAgg,
        tagsAgg,
    });

    //adding the imageUrls and tags to the postsAgg object as each image and tag is associated with a post with the postId
    Object.values(imagesAgg).forEach((image: any) => {
        postsAgg[image.postId].imageUrls.push(image.imageUrl);
    });

    //same agai for tags
    Object.values(tagsAgg).forEach((tag: any) => {
        postsAgg[tag.postId].tags.push(tag.tagName);
    });

    //returning the altered posts
    return Object.values(postsAgg);
}

export class PostController {
    static CreatePost = async (
        user: any,
        body: { post: Post; roomId?: number; images: string[]; tags: string[] }
    ) => {
        try {
            body.post.userId = user.id;
            body.post.createdAt = new Date();
            const post = await db
                .insert(postsTable)
                .values(body.post)
                .returning({ postId: postsTable.postId });

            if (body.roomId) {
                const postRoom: PostRoom = {
                    postId: post[0].postId,
                    roomId: body.roomId,
                };
                const postRoomsReturned = await db
                    .insert(postRoomsTable)
                    .values(postRoom)
                    .returning();
            }
            //adding to images table
            let images: Image[] = [];
            body.images.forEach((image) => {
                images.push({ postId: post[0].postId, imageUrl: image });
            });

            if (images.length) {
                const imagesReturned = await db
                    .insert(imagesTable)
                    .values(images)
                    .returning();
            }

            //adding to tags table
            let tags: Tag[] = [];
            body.tags.forEach((tag) => {
                tags.push({ postId: post[0].postId, tagName: tag });
            });

            if (tags.length) {
                const tagsReturned = await db
                    .insert(tagsTable)
                    .values(tags)
                    .returning();
            }

            if (body.roomId) {
                const cacheKey = `posts:${body.roomId}`;
                await RedisClient.del(cacheKey);
            } else {
                const cacheKey = "posts:public";
                await RedisClient.del(cacheKey);
            }
        } catch (error) {
            console.error("Error while creating post");
            console.error(error);
        }
    };

    static GetPrivatePosts = async (
        user: any,
        body: {},
        query: { roomId: number }
    ) => {
        try {
            const cacheKey = `posts:${query.roomId}`;

            const cachedPosts = await RedisClient.get(cacheKey);

            if (cachedPosts) {
                console.log("Returning cached posts");
                return JSON.parse(cachedPosts);
            }

            const email = user?.email;
            const privatePosts = await db
                .select()
                .from(postsTable)
                .innerJoin(
                    postRoomsTable,
                    eq(postsTable.postId, postRoomsTable.postId)
                )
                .leftJoin(
                    imagesTable,
                    eq(postsTable.postId, imagesTable.postId)
                )
                .leftJoin(tagsTable, eq(postsTable.postId, tagsTable.postId))
                .innerJoin(users, eq(users.id, postsTable.userId))
                .where(
                    and(
                        eq(postsTable.isPublic, false),
                        eq(postRoomsTable.roomId, query.roomId)
                    )
                )
                .execute();
            const alteredPosts = alterPosts(privatePosts);

            //expires after an hour
            await RedisClient.set(
                cacheKey,
                JSON.stringify(alteredPosts),
                "EX",
                3600
            );

            return alteredPosts;
        } catch (error) {
            console.error("Error while fetching private posts");
        }
    };

    static GetPublicPosts = async () => {
        try {
            const cacheKey = "posts:public";
            const cachedPosts = await RedisClient.get(cacheKey);

            if (cachedPosts) {
                console.log("Returning cached posts");
                return JSON.parse(cachedPosts);
            }

            const publicPosts = await db
                .select()
                .from(postsTable)
                .leftJoin(
                    imagesTable,
                    eq(postsTable.postId, imagesTable.postId)
                )
                .leftJoin(tagsTable, eq(postsTable.postId, tagsTable.postId))
                .innerJoin(users, eq(users.id, postsTable.userId))
                .where(eq(postsTable.isPublic, true))
                .execute();
            const alteredPosts = alterPosts(publicPosts);

            //expires after an hour
            await RedisClient.set(
                cacheKey,
                JSON.stringify(alteredPosts),
                "EX",
                3600
            );

            return alteredPosts;
        } catch (error) {
            console.error("Error while fetching public posts");
            console.error(error);
        }
    };

    static GetPostComments = async (
        user: any,
        body: {},
        query: { postId: number }
    ) => {
        console.log("Fetching comments for post", query.postId);
        try {
            const comments = await db
                .select()
                .from(commentsTable)
                .innerJoin(users, eq(users.id, commentsTable.userId))
                .where(eq(commentsTable.postId, query.postId))
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
        console.log("Creating a new comment");
        body.comment.createdAt = new Date();
        console.log(body.comment);
        try {
            const comment = await db
                .insert(commentsTable)
                .values(body.comment)
                .returning();
            console.log(comment);
        } catch (error) {
            console.error("Error while creating a comment");
        }
    };

    static GetLikes = async (
        user: any,
        body: {},
        query: { postId: number }
    ) => {
        const email = user?.email;

        try {
            const likes = await db
                .select()
                .from(likesTable)
                .innerJoin(users, eq(users.id, likesTable.userId))
                .where(eq(likesTable.postId, query.postId))
                .execute();

            return likes;
        } catch (error) {
            console.error("error while getting likes");
        }
    };

    static LikePost = async (user: any, body: { like: Like }) => {
        try {
            body.like.createdAt = new Date();
            const like = await db
                .insert(likesTable)
                .values(body.like)
                .execute();
            return like;
        } catch (error) {
            console.error("Error while creating a like");
            console.error(error);
        }
    };

    static RemoveLike = async (
        user: any,
        body: { postId: number; userId: number }
    ) => {
        try {
            const removed = await db
                .delete(likesTable)
                .where(
                    and(
                        eq(likesTable.postId, body.postId),
                        eq(likesTable.userId, body.userId)
                    )
                )
                .execute();

            console.log(removed);
        } catch (error) {
            console.error("Error while deleting a like");
            console.error(error);
        }
    };
}
