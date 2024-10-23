import React from "react";
import { Post } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
function PostCard({ id, title, description, images, timestamp, tags }: Post) {
  return (
    <Card className="w-full mx-auto">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="w-12 h-12">
          <AvatarImage
            src="/placeholder.svg?height=50&width=50"
            alt="@johndoe"
          />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <h2 className="text-lg font-semibold">Harshit Bansal</h2>
          <p className="text-sm text-muted-foreground">bansalharshit032@gmail.com</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
        {images ? (
          images.length < 3 ? (
            <div className={`grid grid-cols-${images.length} gap-2 `}>
              {images?.map((image, index) => (
                <img key={index} src={image as string} alt="image" className="max-h-"/>
              ))}
            </div>
          ) : (
            <div className="w-full flex justify-center px-8">
              <Carousel className="flex justify-center">
                <CarouselContent>
                  {images.map((image, index) => (
                    <CarouselItem key={index}>
                      <div>
                        <Card>
                          <CardContent className="flex items-center justify-center pb-6 pt-6">
                            <img
                              key={index}
                              src={image as string}
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
        <Button variant="ghost" size="sm">
          <MessageCircle className="w-5 h-5 mr-1" />
          Comment
        </Button>
        <Button variant="ghost" size="sm">
          <Share2 className="w-5 h-5 mr-1" />
          Share
        </Button>
      </CardFooter>
    </Card>
  );
}

export default PostCard;
