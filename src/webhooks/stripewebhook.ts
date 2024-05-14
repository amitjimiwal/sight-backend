import Stripe from "stripe";
import stripe from "../lib/stripe.js";
import config from "../config/config.js";
import { ApiError } from "../lib/Apierror.js";
import prisma from "../db/dbconfig.js";
import { ApiResponse } from "../lib/ApiResponse.js";
import { Response ,Request} from "express";
async function stripeWebhook(req: Request, res: Response) {
     const body = req.body;
     const signature = req.headers['stripe-signature'] as string;
     let event: Stripe.Event;
     event = stripe.webhooks.constructEvent(
          body,
          signature,
          config.stripeWebhookSecret
     );
     // Handle the event
     const session = event.data.object as Stripe.Checkout.Session;
     switch (event.type) {
          case 'checkout.session.completed':
               if (!session?.metadata?.userId) {
                    throw new ApiError(401, "User Id not found in metadata");
               }
               const subscription = await stripe.subscriptions.retrieve(session.subscription as string) as Stripe.Subscription;
               await prisma.subscription.create({
                    data: {
                         userId: Number(session.metadata.userId),
                         stripeCustomerId: subscription.customer as string,
                         stripeSubscriptionId: subscription.id,
                         stripePriceId: subscription.items.data[0].price.id,
                         stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
                    }
               });
               break;
          case 'invoice.payment_succeeded':
               const sub = await stripe.subscriptions.retrieve(
                    session.subscription as string
               );
               await prisma.subscription.update({
                    where: {
                         stripeSubscriptionId: sub.id
                    },
                    data: {
                         stripePriceId: sub.items.data[0].price.id,
                         stripeCurrentPeriodEnd: new Date(sub.current_period_end * 1000),
                    }
               });
     }
     return res.json(new ApiResponse(`Webhook for ${event.type} Received`, {}, req.url, 200));
}
export { stripeWebhook }