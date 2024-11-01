import express from "express";
import { UserController } from "@/controllers/users";
import jwtAuth from "@/lib/middleware/jwtAuth";
const router = express.Router();

export function ControllerRunner<B, R>(
    controller: (user: any, body: B) => R
): express.RequestHandler {
    return async (req, res, next) => {
        try {
            res.json({
                success: true,
                data: await controller(req.user, req.body),
            });
        } catch (e) {
            res.json({
                success: false,
                error: e,
            });
        }
    };
}

router.use(jwtAuth);

router.get("/", ControllerRunner(UserController.listUsers));

router.get("/getuserdetails", ControllerRunner(UserController.getUserDetails));

export default router;
