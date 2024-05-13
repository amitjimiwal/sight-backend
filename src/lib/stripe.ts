
import Stripe from 'stripe';
import config from '../config/config.js';
//how to use stripe secret key

const stripe = new Stripe(config.stripeSecret,{
     typescript: true
});
export default stripe;