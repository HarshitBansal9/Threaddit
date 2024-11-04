import express from "express";

import jwtAuth from "@/lib/middleware/jwtAuth";
import { ControllerRunner } from "../users";

import { PostController } from "@/controllers/posts";
const router = express.Router();

router.use(jwtAuth);

router.post("/createpost", ControllerRunner(PostController.CreatePost));

router.get("/getpubposts", ControllerRunner(PostController.GetPublicPosts));

router.get("/postsforroom", ControllerRunner(PostController.GetPrivatePosts));

router.get(
    "/getpostcomments",
    ControllerRunner(PostController.GetPostComments)
);

router.post(
    "/createcomment",
    ControllerRunner(PostController.CreatePostComment)
);

router.get("");
export default router;
