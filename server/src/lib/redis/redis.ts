import { REDIS_PORT, REDIS_HOST } from "@/config/environment";
import { error } from "console";
import Redis from "ioredis";

const redisClient = new Redis({
    host:REDIS_HOST,
    port:REDIS_PORT as unknown as number
})

redisClient.on("error",()=>{
    console.error("Failed to connect to redis",error);
})


export default redisClient;
