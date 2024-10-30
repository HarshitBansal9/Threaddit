import { JWT_SECRET } from "@/config/environment";
import express from "express";
import jwt from "jsonwebtoken";
const handler: express.RequestHandler = (req, res, next) => {
    try {
        const { authorization } = req.headers;
        if (!authorization || !authorization.startsWith("Bearer ")) {
            throw new Error("unauthorized");
        }
        const token = authorization?.split(" ")[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        if (!decoded) {
            throw new Error("unauthorized");
        }
        
    } catch (error) {
        res.status(401);
        throw error;
    }
};

export default handler;
