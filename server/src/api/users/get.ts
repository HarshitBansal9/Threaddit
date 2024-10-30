import db from '@/lib/db';
import { users } from '@/lib/db/schema/users';
import express from 'express'
import expressAsyncHandler from 'express-async-handler';



const router = express.Router();

router.get('/',expressAsyncHandler(async (req,res,next)=>{
    try {
        const data = await db.select().from(users)
    } catch (error){
        console.error("Error while fetching the users")
    }
}))

export default router;