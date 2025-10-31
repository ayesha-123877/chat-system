import { redisClient } from "../config/redis.js";

//  User online karo - Redis mein save
export async function setUserOnline(userId, socketId) {
  try {
    await redisClient.set(`online:${userId}`, socketId);
    console.log(` User ${userId} is now online (Socket: ${socketId})`);
  } catch (error) {
    console.error("Redis setUserOnline error:", error);
  }
}

//  User offline karo - Redis se delete
export async function setUserOffline(userId) {
  try {
    await redisClient.del(`online:${userId}`);
    console.log(` User ${userId} is now offline`);
  } catch (error) {
    console.error("Redis setUserOffline error:", error);
  }
}

//  Check if user online hai
export async function isUserOnline(userId) {
  try {
    const socketId = await redisClient.get(`online:${userId}`);
    return socketId !== null;
  } catch (error) {
    console.error("Redis isUserOnline error:", error);
    return false;
  }
}

//  NEW: Get all online users
export async function getAllOnlineUsers() {
  try {
    const keys = await redisClient.keys("online:*");
    const onlineUserIds = keys.map(key => key.replace("online:", ""));
    console.log(` Online users: ${onlineUserIds.length}`, onlineUserIds);
    return onlineUserIds;
  } catch (error) {
    console.error("Redis getAllOnlineUsers error:", error);
    return [];
  }
}