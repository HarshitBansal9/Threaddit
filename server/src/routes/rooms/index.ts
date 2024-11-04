import express from "express";
import { UserController } from "@/controllers/users";
import jwtAuth from "@/lib/middleware/jwtAuth";
import { ControllerRunner } from "../users";
import { RoomController } from "@/controllers/rooms";
const router = express.Router();

router.use(jwtAuth);

router.post("/createroom", ControllerRunner(RoomController.CreateRoom));

router.get("/getrooms", ControllerRunner(RoomController.GetRooms));

router.get("/getroommembers", ControllerRunner(RoomController.getRoomMembers));

router.post("/makeadmin", ControllerRunner(RoomController.makeUserAdmin));

export default router;
