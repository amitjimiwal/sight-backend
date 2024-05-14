import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../lib/ApiResponse.js";
import config from "../config/config.js";
import Stripe from "stripe";
import prisma from "../db/dbconfig.js";
import { getAbsolutePath } from "../lib/functions/pathHelper.js";
import { ApiError } from "../lib/Apierror.js";
const stripe = new Stripe(config.stripeSecret, {
     typescript: true
});
async function createSubscription(req: Request, res: Response, next: NextFunction) {
     const user = req.body.user;
     //check if user already has some subscription
     const userSubscription = await prisma.subscription.findUnique({
          where: {
               userId: user.id
          }
     })
     //if user has subscription and then go forward to billing portal
     if (userSubscription && userSubscription.stripeCustomerId) {
          let returnurl = getAbsolutePath("pricing?redirect=billingportal");
          const stripeBillingsession = await stripe.billingPortal.sessions.create({
               customer: userSubscription.stripeCustomerId,
               return_url: returnurl
          })
          return res.json(new ApiResponse("Checking out to billing Portal", {
               redirect_url: stripeBillingsession.url
          }, req.url, 200));
     }
     //if user does'nt have any subscription checkout new session and create customer
     const stripecheckoutsession = await stripe.checkout.sessions.create({
          success_url: `${config.frontendUrl}/pricing?success=true`,
          cancel_url: `${config.frontendUrl}/pricing?success=false`,
          currency:"inr",
          payment_method_types: ["card"],
          mode: "subscription",
          customer_email: user.email,
          billing_address_collection: "required",
          line_items: [
               {
                    price: config.stripePriceId,
                    quantity: 1
               }
          ],
          metadata: {
               userId: user.id
          },
     });
     return res.json(new ApiResponse("Checkout session created", {
          redirect_url: stripecheckoutsession.url
     }, req.url, 200));
}
async function getsubscription(req: Request, res: Response, next: NextFunction) {
     const user = req.body.user;
     const userSubscription = await prisma.subscription.findUnique({
          where: {
               userId: user.id
          }
     })
     if (!userSubscription) {
          throw new ApiError(404, "No Subscription found")
     }
     return res.json(new ApiResponse("Found Subscription", userSubscription, req.url, 200));
}
export { createSubscription, getsubscription };