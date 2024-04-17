import * as dotenv from "dotenv";
dotenv.config();
const config = {
  port: process.env.PORT || 3000,
  corsOrigin: String(process.env.CORS_ORIGIN),
  jwtSecret: String(process.env.JWT_SECRET),
  hostEmail: String(process.env.HOST_EMAIL),
  hostPassword: String(process.env.HOST_EMAIL_PASSWORD),
  stripeApiKey: String(process.env.STRIPE_API_KEY),
  stripeSecret: String(process.env.STRIPE_SECRET),
  frontendUrl: String(process.env.FRONTEND_URL),
  stripePriceId: String(process.env.STRIPE_PRICE_ID),
  stripeWebhookSecret:String(process.env.STRIPE_WEBHOOK_SECRET)
};
export default config;
