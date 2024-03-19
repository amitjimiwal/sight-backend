import * as dotenv from "dotenv";
dotenv.config();
const config = {
  port: process.env.PORT || 3000,
  corsOrigin: String(process.env.CORS_ORIGIN),
  jwtSecret: String(process.env.JWT_SECRET),
};
export default config;
