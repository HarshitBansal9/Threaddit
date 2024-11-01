import db from "@/lib/db";
import { membersTable } from "@/lib/db/schema/members";
import { roomsTable } from "@/lib/db/schema/rooms";

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
    static createRoom = async (room: Room, users: any) => {
        try {
            const roomId = await db
                .insert(roomsTable)
                .values(room)
                .returning({ roomId: roomsTable.roomId });
            let alteredUsers: roomMember[] = [];
            users.map((user: any, index: number) => {
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
}
