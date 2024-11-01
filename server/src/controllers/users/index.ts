import db from "@/lib/db";
import { users } from "@/lib/db/schema/users";
import { eq, sql } from "drizzle-orm";
import express from "express";

export class UserController {
    static listUsers = async (user: any,body:{}) => {
        try {
            const email = user?.email;
            const userList = await db
                .select()
                .from(users)
                .where(sql`not ${users.email} = ${email}`);
            return userList;
        } catch (error) {
            console.error("Error while fetching the users");
        }
    };

    static getUserDetails = async (user: any, body: {}) => {
        try {
            const email = user?.email;
            const userDetails = await db
                .select()
                .from(users)
                .where(eq(users.email, email));
            return userDetails;
        } catch (error) {
            console.error("Error while fetching the user details");
        }
    };
}
