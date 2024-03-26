import * as dotenv from "dotenv";
dotenv.config();
const config = {
  port: process.env.PORT || 3000,
  corsOrigin: String(process.env.CORS_ORIGIN),
  jwtSecret: String(process.env.JWT_SECRET),
  hostEmail: String(process.env.HOST_EMAIL),
  hostPassword: String(process.env.HOST_EMAIL_PASSWORD),
  razorPayKey: String(process.env.RAZORPAY_API_KEY),
  razorPaySecret: String(process.env.RAZORPAY_API_SECRET),
  planId: String(process.env.PRO_PLAN_ID),
};
export default config;
