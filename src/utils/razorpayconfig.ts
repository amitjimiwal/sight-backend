import Razorpay from "razorpay";
import config from "../config/config.js";

const razorPay = new Razorpay({
     key_id: config.razorPayKey,
     key_secret: config.razorPaySecret,
});
export { razorPay };