import { RedisClientType, createClient } from "redis";
import { REDIS_DEFAULT_EXPIRATION } from "../constants";

const ENV = process.env.NODE_ENV;
const REDIS_CONNECTION_URL = process.env.REDIS_CONNECTION_URL;

let redis_client: RedisClientType;

(async () => {
  if (!REDIS_CONNECTION_URL && ENV !== "local") return;

  redis_client =
    ENV === "local"
      ? createClient()
      : createClient({ url: process.env.REDIS_CONNECTION_URL });

  redis_client.on("error", (error) => console.error(`Error : ${error}`));

  await redis_client.connect();
  console.log("> redis connected");
})();

export const getCache = async (key: string) => {
  if (!REDIS_CONNECTION_URL && ENV !== "local") return;

  const value = await redis_client.get(key);
  if (!value) return null;
  return JSON.parse(value);
};

export const setCache = async (key: string, value: unknown) => {
  if (!REDIS_CONNECTION_URL && ENV !== "local") return;

  await redis_client.setEx(
    key,
    REDIS_DEFAULT_EXPIRATION,
    JSON.stringify(value)
  );
};

export const clearCache = async () => {
  if (!REDIS_CONNECTION_URL && ENV !== "local") return;

  await redis_client.flushAll();
};
