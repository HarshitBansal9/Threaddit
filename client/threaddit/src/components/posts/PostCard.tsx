import React, { useEffect, useState } from "react";
import { AlteredPost } from "@/lib/types";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
// import {CloudinaryImage} from "@cloudinary/base/assets/cloudinaryImage";
// import {AdvancedImage} from "@cloudinary/react";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Badge, Heart, MessageCircle, Share2 } from "lucide-react";
import { Button } from "../ui/button";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "../ui/carousel";
import { axiosInstance } from "@/axios/axiosInstance";
import { formatDistanceToNow } from "date-fns";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@radix-ui/react-dialog";
import { DialogHeader } from "../ui/dialog";
import { Input } from "../ui/input";
import { useAtom } from "jotai";
import { myUserAtom } from "@/lib/atoms";

const postComment = async (comment: string, postId: number, userId: number) => {
    try {
        await axiosInstance.post("/api/posts/createcomment", {
            comment: {
                commentBody: comment,
                createdAt: new Date(),
                postId: postId,
                userId: userId,
            },
        });
    } catch (error) {
        console.error("Error while creating a comment");
    }
};
function PostCard({
    postId,
    userId,
    username,
    email,
    title,
    description,
    imageUrls,
    createdAt,
    tags,
    commentsEnabled,
}: AlteredPost) {
    const [commentsLoading, setCommentsLoading] = useState(true);
    const [comments, setComments] = useState<any[]>([]);
    const [commentTyped, setCommentTyped] = useState(""); // for the comment input
    const [myUser, setMyUser] = useAtom(myUserAtom);

    const fetchComments = async (postId: number) => {
        console.log("fetching comments", postId);
        const data = await axiosInstance.get("/api/posts/getpostcomments", {
            params: { postId },
        });
        return data.data;
    };
    useEffect(() => {
        if (commentsEnabled) {
            fetchComments(postId).then((comments) => {
                console.log("Comments", comments.data);
                setComments(comments.data);
                setCommentsLoading(false);
            });
        }
    }, []);
    return (
        <Dialog>
            <Card className="w-full mx-auto mb-4">
                <CardHeader className="flex flex-row items-center gap-4">
                    <Avatar className="w-12 h-12">
                        <AvatarImage
                            src="/placeholder.svg?height=50&width=50"
                            alt="@johndoe"
                        />
                        <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <h2 className="text-lg font-semibold">{username}</h2>
                        <p className="text-sm text-muted-foreground">{email}</p>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <h3 className="text-xl font-bold">{title}</h3>
                    <p className="text-muted-foreground">{description}</p>
                    {imageUrls ? (
                        imageUrls.length < 3 ? (
                            <div
                                className={`grid grid-cols-${imageUrls.length} gap-2 `}
                            >
                                {imageUrls?.map((image, index) => (
                                    <img
                                        key={index}
                                        src={image as string}
                                        alt="image"
                                        className="max-h-"
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="w-full flex justify-center px-8">
                                <Carousel className="flex justify-center">
                                    <CarouselContent>
                                        {imageUrls.map((image, index) => (
                                            <CarouselItem key={index}>
                                                <div>
                                                    <Card>
                                                        <CardContent className="flex items-center justify-center pb-6 pt-6">
                                                            <img
                                                                key={index}
                                                                src={
                                                                    image as string
                                                                }
                                                                alt="image"
                                                            />
                                                        </CardContent>
                                                    </Card>
                                                </div>
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>
                                    <CarouselPrevious />
                                    <CarouselNext />
                                </Carousel>
                            </div>
                        )
                    ) : (
                        <div></div>
                    )}
                    <div className="flex flex-wrap gap-2">
                        {tags?.map((tag, index) => (
                            <Badge key={index}>{tag}</Badge>
                        ))}
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="ghost" size="sm">
                        <Heart className="w-5 h-5 mr-1" />
                        Like
                    </Button>

                    <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                            <MessageCircle className="w-5 h-5 mr-1" />
                            Comment
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Comments</DialogTitle>
                        </DialogHeader>
                        {commentsLoading ? (
                            <p>Loading comments...</p>
                        ) : (
                            <div>
                                {comments.map((comment, index) => (
                                    <Card
                                        className="max-w-md w-full"
                                        key={index}
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-start space-x-4">
                                                <div className="flex-1 space-y-1.5">
                                                    <div className="flex items-center space-x-2">
                                                        <h3 className="font-semibold text-sm">
                                                            {
                                                                comment.users
                                                                    .username
                                                            }
                                                        </h3>
                                                        <span className="text-xs text-muted-foreground">
                                                            {
                                                                comment.comments
                                                                    .createdAt
                                                            }
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-foreground">
                                                        {
                                                            comment.comments
                                                                .commentBody
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                        <Input
                            type="text"
                            placeholder="Add a comment"
                            onChange={(e) => {
                                setCommentTyped(e.target.value);
                            }}
                        />
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                                console.log(commentTyped);
                                if (myUser) {
                                    console.log(
                                        "Reached here inside post comment"
                                    );
                                    postComment(
                                        commentTyped,
                                        postId,
                                        myUser.id
                                    );
                                }
                            }}
                        >
                            Post
                        </Button>
                    </DialogContent>
                    <Button variant="ghost" size="sm">
                        <Share2 className="w-5 h-5 mr-1" />
                        Share
                    </Button>
                </CardFooter>
            </Card>
        </Dialog>
    );
}

export default PostCard;
