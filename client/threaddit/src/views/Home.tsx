import React, { useEffect, useRef, useState } from "react";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@radix-ui/react-menubar";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronRight } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { AlteredPost, Post, User } from "@/lib/types";
import PostCard from "@/components/posts/PostCard";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ScrollBar } from "@/components/ui/scroll-area";
import useSWR, { useSWRConfig } from "swr";
import { axiosInstance } from "@/axios/axiosInstance";
import { useAtom } from "jotai";
import { myUserAtom, usersAtom } from "@/lib/atoms";
import { Checkbox } from "@/components/ui/checkbox";
import { get } from "http";

export const formSchema = z.object({
    username: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
    description: z.string().min(10, {
        message: "Description must be at least 10 characters.",
    }),
});

export const useUsersList = () => {
    const { data, error, isLoading } = useSWR("/api/users", fetcher);
    const users = data?.data;
    console.log(users);
    return {
        users: users ?? [],
        isUsersLoading: isLoading,
    };
};

const getPosts = () => {
    const { data, error, isLoading } = useSWR(
        "/api/posts/getpubposts",
        fetcher
    );
    const posts = data?.data;
    console.log(posts);
    return {
        publicPosts: posts ?? [],
        isPostsLoading: isLoading,
    };
};

const createPost = async (post: Post, images: string[], tags: string[]) => {
    await axiosInstance
        .post("/api/posts/createpost", {
            post: post,
            images: images,
            tags: tags,
        })
        .then((res) => {
            console.log(res);
        })
        .then((res) => {
            console.log(res);
            getPosts();
        });
};

export const fetcher = (url: string) =>
    axiosInstance.get(url).then((res) => res.data);

function Home() {
    const [images, setImages] = useState<(File | String)[]>([]);
    const [myUser, setMyUser] = useAtom(myUserAtom);
    const [commentsEnabled, setCommentsEnabled] = useState<boolean>(false);
    const { users, isUsersLoading } = useUsersList();
    const { publicPosts, isPostsLoading } = getPosts();

    function handleChange(e: any) {
        setImages([...images, URL.createObjectURL(e.target.files[0])]);
    }

    const inputFile = useRef<HTMLInputElement | null>(null);
    const onButtonClick = () => {
        inputFile.current?.click();
    };
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            description: "",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
    }
    return (
        <div className="px-48 flex flex-row">
            <div className="w-1/4 pt-24">
                <Card className="w-full">
                    <CardHeader className="flex flex-row items-center gap-4">
                        <Avatar>
                            <AvatarImage
                                src="https://github.com/shadcn.png"
                                alt="@shadcn"
                            />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <CardTitle className="text-md">
                                Harshit Bansal
                            </CardTitle>
                            <CardDescription className="text-sm">
                                @shadcn
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="flex flex-col">
                        <Separator />
                        <div className="flex flex-row items-center w-full justify-evenly border-b-[1px] pb-3">
                            <div className="flex justify-center text-center flex-col">
                                <CardDescription className="text-sm">
                                    Followers
                                </CardDescription>
                                <CardTitle className="text-lg">18</CardTitle>
                            </div>
                            <Separator />
                            <div className="flex justify-center text-center flex-col">
                                <CardDescription className="text-sm">
                                    Posts
                                </CardDescription>
                                <CardTitle className="text-lg">2</CardTitle>
                            </div>
                            <Separator />
                            <div className="flex justify-center text-center flex-col">
                                <CardDescription className="text-sm">
                                    Rooms
                                </CardDescription>
                                <CardTitle className="text-lg">8</CardTitle>
                            </div>
                        </div>
                        <Separator />
                        <div className="flex flex-col pt-3 justify-left gap-2 w-full border-b-[1px] pb-3">
                            <CardDescription className="text-sm">
                                Latest Activity:{" "}
                            </CardDescription>
                            <CardTitle className="text-md">
                                Deploying a React App
                            </CardTitle>
                        </div>
                    </CardContent>
                    <CardFooter className="flex pt-0 justify-between">
                        <CardDescription className="text-md hover:text-white">
                            Your Profile
                        </CardDescription>
                        <ChevronRight
                            color="gray"
                            className="w-6 h-6 ml-auto mr-3"
                        />
                    </CardFooter>
                </Card>

                <div className="w-full flex justify-center pt-5">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button
                                variant="outline"
                                className="px-12 py-8 text-xl w-full"
                            >
                                Create Public Post
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Create a public post.</DialogTitle>
                                <DialogDescription>
                                    Create posts for everyone to see here. Click
                                    save when you're done.
                                </DialogDescription>
                            </DialogHeader>
                            <Form {...form}>
                                <form
                                    onSubmit={form.handleSubmit(onSubmit)}
                                    className="space-y-8"
                                >
                                    <FormField
                                        control={form.control}
                                        name="username"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Title</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Add a title"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Description
                                                </FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Enter your description here"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="w-full flex justify-center">
                                        {images.length > 0 ? (
                                            <Carousel className="w-full max-w-xs flex justify-center">
                                                <CarouselContent>
                                                    {images.map(
                                                        (image, index) => (
                                                            <CarouselItem
                                                                key={index}
                                                            >
                                                                <div>
                                                                    <Card>
                                                                        <CardContent className="flex items-center justify-center h-48  pb-6 pt-6">
                                                                            <img
                                                                                key={
                                                                                    index
                                                                                }
                                                                                src={
                                                                                    image as string
                                                                                }
                                                                                alt="image"
                                                                                className="max-h-48 min-h-24"
                                                                            />
                                                                        </CardContent>
                                                                    </Card>
                                                                </div>
                                                            </CarouselItem>
                                                        )
                                                    )}
                                                </CarouselContent>
                                                <CarouselPrevious />
                                                <CarouselNext />
                                            </Carousel>
                                        ) : (
                                            <div></div>
                                        )}
                                    </div>
                                    <div className="flex flex-row gap-2">
                                        <Input
                                            type="file"
                                            id="file"
                                            ref={inputFile}
                                            style={{ display: "none" }}
                                            onChange={handleChange}
                                        />
                                        <Button onClick={onButtonClick}>
                                            Attach Image
                                        </Button>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="terms"
                                                onCheckedChange={() => {
                                                    setCommentsEnabled(
                                                        !commentsEnabled
                                                    );
                                                }}
                                            />
                                            <label
                                                htmlFor="terms"
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                Enable Comments
                                            </label>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button
                                                variant="outline"
                                                onClick={() => {
                                                    setImages([]);
                                                    form.reset();
                                                }}
                                            >
                                                Cancel
                                            </Button>
                                        </DialogClose>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="outline">
                                                    Save Post
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>
                                                        Are you absolutely sure?
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be
                                                        undone. This will
                                                        permanently post.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>
                                                        Cancel
                                                    </AlertDialogCancel>
                                                    <DialogClose asChild>
                                                        <Button
                                                            onClick={() => {
                                                                createPost(
                                                                    {
                                                                        userId:
                                                                            myUser?.id ??
                                                                            0,

                                                                        title: form.getValues(
                                                                            "username"
                                                                        ),
                                                                        description:
                                                                            form.getValues(
                                                                                "description"
                                                                            ),
                                                                        createdAt:
                                                                            new Date(),
                                                                        isPublic:
                                                                            true,
                                                                        commentsEnabled:
                                                                            commentsEnabled,
                                                                    },
                                                                    images.map(
                                                                        (
                                                                            image
                                                                        ) => {
                                                                            return image as string;
                                                                        }
                                                                    ),
                                                                    []
                                                                );
                                                                setImages([]);
                                                                form.reset();
                                                            }}
                                                            type="submit"
                                                            variant="secondary"
                                                        >
                                                            Post
                                                        </Button>
                                                    </DialogClose>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </DialogFooter>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <ScrollArea className="w-1/2 p-2 max-h-[100dvh] flex flex-col gap-4 overflow-auto ">
                {isPostsLoading ? (
                    <div>Loading.......</div>
                ) : (
                    publicPosts.map((post: AlteredPost, index: number) => (
                        <PostCard
                            key={index}
                            postId={post.postId}
                            userId={post.userId}
                            username={post.username}
                            email={post.email}
                            isPublic={post.isPublic}
                            commentsEnabled={post.commentsEnabled}
                            title={post.title}
                            description={post.description}
                            imageUrls={post.imageUrls}
                            createdAt={post.createdAt}
                            tags={post.tags}
                        ></PostCard>
                    ))
                )}
                <ScrollBar orientation="vertical" />
            </ScrollArea>
            <div className="w-1/4">
                {isUsersLoading ? (
                    <div>Loading .......</div>
                ) : (
                    <div className="flex flex-col gap-2">
                        <div className="pl-2 pt-2 text-2xl font-bold">
                            Other users:
                        </div>
                        {users.map((user: User, index: number) => (
                            <Card
                                key={index}
                                className="border-none w-full hover:"
                            >
                                <CardHeader>
                                    <CardTitle>{user.username}</CardTitle>
                                    <CardDescription>
                                        {user.email}
                                    </CardDescription>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Home;
