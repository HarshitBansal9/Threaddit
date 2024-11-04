"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card";
import {
    Lock,
    Search,
    MoreVertical,
    MessageSquare,
    Heart,
    Share2,
    PlusCircle,
} from "lucide-react";
import PostCard from "@/components/posts/PostCard";
import { title } from "process";
import { time } from "console";
import { AlteredPost, Post, User } from "@/lib/types";
import { set, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { fetcher, formSchema, useUsersList } from "./Home";
import { z } from "zod";
import Axios from "axios";
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
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
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
import { myUserAtom } from "@/lib/atoms";
import { useAtom } from "jotai";
import { Checkbox } from "@/components/ui/checkbox";
import { axiosInstance } from "@/axios/axiosInstance";
import useSWR from "swr";

const roomFormSchema = z.object({
    roomName: z.string().min(2, {
        message: "Room name must be at least 2 characters long",
    }),
});

async function createRoom(
    users: (User | null)[],
    roomName: string,
    myUser: User | null
) {
    console.log("Room name", roomName);
    await axiosInstance.post("/api/rooms/createroom", {
        room: {
            roomName: roomName,
            createdAt: new Date(),
            createdBy: myUser?.id,
        },
        users: users,
    });
    console.log("Users getting added to the room", users);
}

const getRooms = () => {
    const { data, error, isLoading } = useSWR("/api/rooms/getrooms", fetcher);
    const rooms = data?.data;
    console.log("Rooms", rooms);
    return {
        rooms: rooms ?? [],
        isRoomsLoading: isLoading,
    };
};
const getPostsForRoom = async (roomId: string) => {
    try {
        const data = await axiosInstance.get("/api/posts/postsforroom", {
            params: { roomId },
        });
        console.log("Posts for room", data.data);
        return data.data;
    } catch (error) {
        console.error(error);
    }
};
const createPost = async (
    post: Post,
    cloudinaryImages: File[],
    tags: string[],
    roomId: string
) => {
    const cloudImages: string[] = [];

    try {
        // Upload images to Cloudinary
        await Promise.all(
            cloudinaryImages.map(async (image) => {
                const formData = new FormData();
                formData.append("file", image);
                formData.append("upload_preset", "threaddit");

                const res = await Axios.post(
                    "https://api.cloudinary.com/v1_1/ddlgdzfrn/image/upload",
                    formData
                );

                console.log(res);
                cloudImages.push(res.data.url);
            })
        );

        // Create post with the uploaded image URLs
        const postResponse = await axiosInstance.post("/api/posts/createpost", {
            post: post,
            images: cloudImages,
            tags: tags,
            roomId: roomId,
        });

        console.log(postResponse);

        // Fetch posts for the room
        await getPostsForRoom(roomId);
    } catch (error) {
        console.error("An error occurred:", error);
    }
};

function Rooms() {
    const [images, setImages] = useState<(File | String)[]>([]);
    const [cloudinaryImages, setCloudinaryImages] = useState<File[]>([]);
    const [posts, setPosts] = useState<any[]>([]);
    const [myUser, setMyUser] = useAtom(myUserAtom);
    const { rooms, isRoomsLoading } = getRooms();
    const [commentsEnabled, setCommentsEnabled] = useState<boolean>(false);
    let myUserForRoom: any = myUser;
    myUserForRoom.isAdmin = true;
    const [usersToBeAdded, setUsersToBeAdded] = useState<any[]>([
        myUserForRoom,
    ]);
    const { users, isUsersLoading } = useUsersList();

    function handleChange(e: any) {
        setImages([...images, URL.createObjectURL(e.target.files[0])]);
        setCloudinaryImages([...cloudinaryImages, e.target.files[0]]);
    }
    const inputFile = useRef<HTMLInputElement | null>(null);
    const onButtonClick = () => {
        inputFile.current?.click();
    };
    const roomForm = useForm<z.infer<typeof roomFormSchema>>({
        resolver: zodResolver(roomFormSchema),
        defaultValues: {
            roomName: "",
        },
    });

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
    const [selectedRoom, setSelectedRoom] = useState<any>(null);

    return (
        <div className="flex h-screen bg-background">
            {/* Sidebar */}
            <div className="w-1/4 border-r">
                <div className="p-2 flex flex-row gap-2">
                    <div className="relative w-1/2">
                        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input placeholder="Search rooms" className="pl-8" />
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="text-lg w-1/2">
                                Create A Room
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Create A Room</DialogTitle>
                                <DialogDescription>
                                    Create A room here. You will automatically
                                    be made the admin.
                                </DialogDescription>
                            </DialogHeader>
                            <Form {...roomForm}>
                                <form
                                    onSubmit={roomForm.handleSubmit(() => {
                                        console.log("form submitted");
                                    })}
                                    className="space-y-8"
                                >
                                    <FormField
                                        control={roomForm.control}
                                        name="roomName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Room Name</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Add a room name"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    {users.map((user: User) => (
                                        <div
                                            key={user.id}
                                            className="flex items-center"
                                        >
                                            <Checkbox
                                                checked={usersToBeAdded.includes(
                                                    user
                                                )}
                                                onCheckedChange={(checked) => {
                                                    if (checked) {
                                                        let userToBeAdded: any =
                                                            user;
                                                        userToBeAdded.isAdmin =
                                                            false;
                                                        setUsersToBeAdded([
                                                            ...usersToBeAdded,
                                                            userToBeAdded,
                                                        ]);
                                                    } else {
                                                        setUsersToBeAdded(
                                                            usersToBeAdded.filter(
                                                                (u) =>
                                                                    u !== user
                                                            )
                                                        );
                                                    }
                                                }}
                                            />
                                            <span className="ml-2">
                                                {user.username}
                                            </span>
                                        </div>
                                    ))}
                                </form>
                            </Form>

                            <DialogFooter>
                                <Button
                                    onClick={() => {
                                        roomForm.handleSubmit((data) => {
                                            roomForm.reset();
                                            if (usersToBeAdded.length === 1) {
                                                alert(
                                                    "Please add at least one user to the room"
                                                );
                                            } else {
                                                createRoom(
                                                    usersToBeAdded,
                                                    data.roomName,
                                                    myUser
                                                );
                                            }
                                        })();
                                    }}
                                    type="submit"
                                >
                                    Create Room
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
                <ScrollArea className="h-[calc(100vh-120px)]">
                    {rooms.map((room: any) => (
                        <div
                            key={room.rooms.roomId}
                            className={`flex items-center p-3 cursor-pointer hover:bg-muted ${
                                selectedRoom?.rooms.roomId === room.rooms.roomId
                                    ? "bg-muted"
                                    : ""
                            }`}
                            onClick={async () => {
                                setSelectedRoom(room);
                                const posts = await getPostsForRoom(
                                    room.rooms.roomId
                                );
                                console.log("Posts for room", posts.data);
                                setPosts(posts.data);
                            }}
                        >
                            <Avatar className="h-10 w-10">
                                <AvatarImage
                                    src={`https://api.dicebear.com/6.x/initials/svg?seed=${room.rooms.roomName}`}
                                />
                                <AvatarFallback>
                                    {room.rooms.roomName.slice(0, 2)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="ml-3 flex-1">
                                <div className="flex justify-between">
                                    <span className="font-semibold">
                                        {room.rooms.roomName}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </ScrollArea>
            </div>

            {/* Main content */}
            {selectedRoom != null ? (
                <div className="flex-1 flex flex-col">
                    {/* Room header */}
                    <div className="p-4 bg-muted flex items-center justify-between">
                        <div className="flex items-center">
                            <Avatar className="h-10 w-10">
                                <AvatarImage
                                    src={`https://api.dicebear.com/6.x/initials/svg?seed=${selectedRoom.rooms.roomName}`}
                                />
                                <AvatarFallback>
                                    {selectedRoom.rooms.roomName.slice(0, 2)}
                                </AvatarFallback>
                            </Avatar>
                            <div className="ml-3">
                                <h2 className="font-semibold">
                                    {selectedRoom.rooms.roomName}
                                </h2>
                            </div>
                        </div>

                        <Dialog>
                            <DialogTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="px-8 py-6 text-xl w-1/4"
                                >
                                    Create Private Post
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>
                                        Create a private post.
                                    </DialogTitle>
                                    <DialogDescription>
                                        Create posts for everyone to see here.
                                        Click save when you're done.
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
                                        <DialogFooter>
                                            <DialogClose asChild>
                                                <Button
                                                    variant="outline"
                                                    onClick={() => {
                                                        setImages([]);
                                                        setCloudinaryImages([]);
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
                                                            Are you absolutely
                                                            sure?
                                                        </AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This action cannot
                                                            be undone. This will
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
                                                                                false,
                                                                            commentsEnabled:
                                                                                commentsEnabled,
                                                                        },
                                                                        cloudinaryImages,
                                                                        [],
                                                                        selectedRoom
                                                                            .rooms
                                                                            .roomId
                                                                    );
                                                                    setImages(
                                                                        []
                                                                    );
                                                                    setCloudinaryImages(
                                                                        []
                                                                    );
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

                    {/* Posts */}
                    <ScrollArea className="flex flex-col p-4 gap-2">
                        {!posts || posts.length === 0 ? (
                            <div>No posts yet</div>
                        ) : (
                            posts.map((post: AlteredPost, index: number) => (
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
                    </ScrollArea>
                </div>
            ) : (
                <div>No Rooom selected</div>
            )}
        </div>
    );
}

export default Rooms;
