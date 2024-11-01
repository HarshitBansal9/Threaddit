import db from "@/lib/db";
import { membersTable } from "@/lib/db/schema/members";
import { roomsTable } from "@/lib/db/schema/rooms";
import { users } from "@/lib/db/schema/users";
import { and, eq } from "drizzle-orm";

interface Room {
    roomId: number;
    roomName: string;
    createdAt: Date;
    createdBy: number;
}
interface roomMember {
    roomId: number;
    userId: number;
    isAdmin: boolean;
}

export class RoomController {
    static CreateRoom = async (user: any, body: { room: Room; users: any }) => {
        try {
            const roomId = await db
                .insert(roomsTable)
                .values(body.room)
                .returning({ roomId: roomsTable.roomId });
            let alteredUsers: roomMember[] = [];
            body.users.map((user: any, index: number) => {
                alteredUsers.push({
                    roomId: roomId[0].roomId,
                    userId: user.id,
                    isAdmin: user.isAdmin,
                });
            });

            const usersReturned = await db
                .insert(membersTable)
                .values(alteredUsers)
                .returning();

            console.log(usersReturned);
        } catch (error) {
            console.error("Error while creating a room");
        }
    };

    static GetRooms = async (user: any, body: {}) => {
        try {
            const email = user?.email;
            const rooms = await db
                .select()
                .from(roomsTable)
                .innerJoin(
                    membersTable,
                    eq(roomsTable.roomId, membersTable.roomId)
                )
                .innerJoin(users, eq(users.id, membersTable.userId))
                .where(eq(users.email, email));
        } catch (error) {
            console.error("Error while getting the users rooms");
        }
    };

    static addUserToRoom = async (
        user: any,
        body: { roomId: number; users: any }
    ) => {
        try {
            let alteredUsers: roomMember[] = [];
            body.users.map((user: any, index: number) => {
                alteredUsers.push({
                    roomId: body.roomId,
                    userId: user.id,
                    isAdmin: user.isAdmin,
                });
            });
            const room = await db
                .insert(membersTable)
                .values(alteredUsers)
                .returning();
        } catch (error) {
            console.error("Error while adding user to room");
        }
    };

    static removeUserFromRoom = async (
        user: any,
        body: { roomId: number; userId: number }
    ) => {
        try {
            const room = await db
                .delete(membersTable)
                .where(
                    and(
                        eq(membersTable.roomId, body.roomId),
                        eq(membersTable.userId, body.userId)
                    )
                )
                .returning();
        } catch (error) {
            console.error("Error while removing user from room");
        }
    };

    static makeUserAdmin = async (
        user: any,
        body: { roomId: number; userId: number }
    ) => {
        try {
            const room = await db
                .update(membersTable)
                .set({ isAdmin: true })
                .where(
                    and(
                        eq(membersTable.roomId, body.roomId),
                        eq(membersTable.userId, body.userId)
                    )
                )
                .returning();
        } catch (error) {
            console.error("Error while making user admin");
        }
    };
}
