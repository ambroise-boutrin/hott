import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-02-24.acacia",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = headers().get("stripe-signature") as string;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error("Erreur de signature Webhook Stripe:", err.message);
      return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
    }

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;

      // Extract metadata (cart items and email)
      const cartItemsStr = paymentIntent.metadata?.cart_items || "[]";
      let items: any[] = [];
      try {
        items = JSON.parse(cartItemsStr);
      } catch (e) {
        console.error("Erreur parsing cart_items", e);
      }

      const userEmail = paymentIntent.metadata?.userEmail;
      let userId = null;

      // Try to link order to an existing user if userEmail is provided and not 'guest'
      if (userEmail && userEmail !== "guest") {
        const user = await prisma.user.findUnique({
          where: { email: userEmail },
        });
        if (user) {
          userId = user.id;
        }
      }

      // Extract shipping details
      const shipping = paymentIntent.shipping;

      // Save order in database
      await prisma.order.create({
        data: {
          stripePaymentId: paymentIntent.id,
          amount: paymentIntent.amount / 100, // convert centimes back to euros
          status: "PAID",
          shippingName: shipping?.name,
          addressLine1: shipping?.address?.line1,
          addressLine2: shipping?.address?.line2,
          city: shipping?.address?.city,
          postalCode: shipping?.address?.postal_code,
          country: shipping?.address?.country,
          userId: userId,
          items: {
            create: items.map((item) => ({
              productId: item.id,
              name: item.n, // from our shortened metadata 'n'
              quantity: item.q, // from 'q'
              price: item.p, // from 'p'
            })),
          },
        },
      });

      console.log(`✅ Commande créée avec succès pour PaymentIntent: ${paymentIntent.id}`);
    }

    return new NextResponse(null, { status: 200 });
  } catch (err: any) {
    console.error("Erreur globale Webhook:", err);
    return new NextResponse(`Webhook Server Error: ${err.message}`, { status: 500 });
  }
}
