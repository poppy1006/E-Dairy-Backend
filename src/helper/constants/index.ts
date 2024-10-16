export const allowedOrigins = {
  local: "*",
  development: ["http://localhost:3000"],
  production: ["https://www.example.com"],
};

export const REDIS_DEFAULT_EXPIRATION = 3600; // in seconds. current 1 hr
export const OTP_EXPIRATION_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds
