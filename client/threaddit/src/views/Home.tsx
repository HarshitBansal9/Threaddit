import React, { useRef, useState } from "react";

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
import { Post } from "@/lib/types";
import PostCard from "@/components/posts/PostCard";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ScrollBar } from "@/components/ui/scroll-area";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
});

function Home() {
  const [images, setImages] = useState<(File | String)[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
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
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <CardTitle className="text-md">Harshit Bansal</CardTitle>
              <CardDescription className="text-sm">@shadcn</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col">
            <Separator />
            <div className="flex flex-row items-center w-full justify-evenly border-b-[1px] pb-3">
              <div className="flex justify-center text-center flex-col">
                <CardDescription className="text-sm">Followers</CardDescription>
                <CardTitle className="text-lg">18</CardTitle>
              </div>
              <Separator />
              <div className="flex justify-center text-center flex-col">
                <CardDescription className="text-sm">Posts</CardDescription>
                <CardTitle className="text-lg">2</CardTitle>
              </div>
              <Separator />
              <div className="flex justify-center text-center flex-col">
                <CardDescription className="text-sm">Rooms</CardDescription>
                <CardTitle className="text-lg">8</CardTitle>
              </div>
            </div>
            <Separator />
            <div className="flex flex-col pt-3 justify-left gap-2 w-full border-b-[1px] pb-3">
              <CardDescription className="text-sm">
                Latest Activity:{" "}
              </CardDescription>
              <CardTitle className="text-md">Deploying a React App</CardTitle>
            </div>
          </CardContent>
          <CardFooter className="flex pt-0 justify-between">
            <CardDescription className="text-md hover:text-white">
              Your Profile
            </CardDescription>
            <ChevronRight color="gray" className="w-6 h-6 ml-auto mr-3" />
          </CardFooter>
        </Card>

        <div className="w-full flex justify-center pt-5">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="px-12 py-8 text-xl w-full">
                Create Public Post
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create a public post.</DialogTitle>
                <DialogDescription>
                  Create posts for everyone to see here. Click save when you're
                  done.
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
                          <Input placeholder="Add a title" {...field} />
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
                        <FormLabel>Description</FormLabel>
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
                          {images.map((image, index) => (
                            <CarouselItem key={index}>
                              <div>
                                <Card>
                                  <CardContent className="flex items-center justify-center h-48  pb-6 pt-6">
                                    <img
                                      key={index}
                                      src={image as string}
                                      alt="image"
                                      className="max-h-48 min-h-24"
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
                  <Button onClick={onButtonClick}>Attach Image</Button>

                  <DialogFooter>
                    <DialogClose asChild>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setImages([]);
                        }}
                      >
                        Cancel
                      </Button>
                    </DialogClose>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline">Save Post</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            post.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <DialogClose asChild>
                            <Button
                              onClick={() => {
                                setPosts([
                                  ...posts,
                                  {
                                    id: Math.random().toString(),
                                    title: form.getValues("username"),
                                    description: form.getValues("description"),
                                    images: images,
                                    timestamp: new Date(),
                                  },
                                ]);
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
        {posts.map((post: Post, index) => (
          <PostCard
            key={post.id}
            id={post.id}
            title={post.title}
            description={post.description}
            images={post.images}
            timestamp={post.timestamp}
            tags={post.tags}
          ></PostCard>
        ))}
        <ScrollBar orientation="vertical" />
        </ScrollArea>
      <div className="w-1/4 border-[1px]"></div>
    </div>
  );
}

export default Home;
