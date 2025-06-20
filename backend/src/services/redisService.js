import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on("error", (err) => console.log("Redis Client Error", err));

(async () => {
  await redisClient.connect();
})();

export const storeTodoInRedis = async (key, value) => {
  try {
    await redisClient.set(key, value);
  } catch (error) {
    console.error("Error storing data in Redis:", error);
    throw error;
  }
};

export const getTodoFromRedis = async (key) => {
  try {
    const value = await redisClient.get(key);
    return value;
  } catch (error) {
    console.error("Error getting data from Redis:", error);
    throw error;
  }
};

export const removeTodoFromRedis = async (key) => {
  try {
    await redisClient.del(key);
  } catch (error) {
    console.error("Error deleting data from Redis:", error);
    throw error;
  }
};
