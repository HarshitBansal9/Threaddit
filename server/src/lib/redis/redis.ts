import { error } from "console";
import Redis from "ioredis";

const redisClient = new Redis({
    host:"localhost",
    port:6379
})

redisClient.on("error",()=>{
    console.error("Failed to connect to redis",error);
})


export default redisClient;