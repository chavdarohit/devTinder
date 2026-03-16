import dotenv from "dotenv";

const envFile = process.env.NODE_ENV
  ? `.env.${process.env.NODE_ENV}`
  : ".env.development";

dotenv.config({ path: envFile });

console.log(`Environment variables loaded from ${envFile}`);
