import express from "express";
import { UserController } from "@/controllers/users";
import jwtAuth from "@/lib/middleware/jwtAuth";
import { ControllerRunner } from "../users";
const router = express.Router();

router.use(jwtAuth);

router.post("/createroom", ControllerRunner(RoomContoller.CreateRoom));

router.get("/getroom", ControllerRunner(RoomContoller.getRoom));

export default router;
