import express from "express";
import { UserController } from "@/controllers/users";
import jwtAuth from "@/lib/middleware/jwtAuth";
const router = express.Router();

export function ControllerRunner<B, R, Q>(
    controller: (user: any, body: B, query: Q) => R
): express.RequestHandler<any, any, B, Q, any> {
    return async (req, res, next) => {
        try {
            res.json({
                success: true,
                data: await controller(req.user, req.body, req.query),
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

router.get("/getmydetails", ControllerRunner(UserController.getUserDetails));

export default router;
