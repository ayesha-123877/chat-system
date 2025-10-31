import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

//  Create Redis client
export const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST || "localhost",
    port: process.env.REDIS_PORT || 6379,
  },
  // Optional: Add password if needed
  // password: process.env.REDIS_PASSWORD,
});

//  Error handling
redisClient.on("error", (err) => {
  console.error(" Redis Client Error:", err);
});

redisClient.on("connect", () => {
  console.log(" Redis connecting...");
});

redisClient.on("ready", () => {
  console.log(" Redis is ready!");
});

//  Connect function
export async function connectRedis() {
  try {
    await redisClient.connect();
    console.log(" Connected to Redis");
  } catch (error) {
    console.error(" Redis connection failed:", error);
    // Don't crash the server if Redis fails
    console.log(" Server will continue without Redis (online status disabled)");
  }
}