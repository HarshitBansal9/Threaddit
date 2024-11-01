import express from "express";
import { UserController } from "@/controllers/users";
import jwtAuth from "@/lib/middleware/jwtAuth";
import { ControllerRunner } from "../users";
import { RoomController } from "@/controllers/rooms";
const router = express.Router();

router.use(jwtAuth);

router.post("/createroom", ControllerRunner(RoomController.CreateRoom));

router.get("/getroom", ControllerRunner(RoomController.GetRooms));

export default router;
