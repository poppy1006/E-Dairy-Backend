import { PrismaClient } from "@prisma/client";
const env = process.env.NODE_ENV;
export const prisma =
  env === "local"
    ? new PrismaClient({
        log: [
          {
            emit: "event",
            level: "query",
          },
        ],
      })
    : new PrismaClient();
