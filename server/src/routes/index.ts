import express from "express";
import usersRouter from "./users";
import roomsRouter from "./rooms";
import postsRouter from "./posts";

const router = express.Router();

router.use("/users", usersRouter);

router.use("/rooms", roomsRouter);

router.use("/posts",postsRouter);

export default router;
