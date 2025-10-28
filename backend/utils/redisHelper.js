import redisClient from "../config/redis.js";

const ONLINE_KEY = "online_users";

export async function setUserOnline(userId, socketId) {
  await redisClient.hSet(ONLINE_KEY, userId, socketId);
}

export async function setUserOffline(userId) {
  await redisClient.hDel(ONLINE_KEY, userId);
}

export async function getOnlineUsers() {
  return await redisClient.hKeys(ONLINE_KEY);
}
