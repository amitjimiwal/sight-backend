
import Stripe from 'stripe';
import config from '../config/config.js';
const stripe = new Stripe(config.stripeApiKey, {
     typescript: true
});
export default stripe;