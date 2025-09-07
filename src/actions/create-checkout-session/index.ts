"use server";

import { headers } from "next/headers";
import Stripe from "stripe";

import { db } from "@/db";
import { auth } from "@/lib/auth";

import { CreateCheckoutSessionSchema,createCheckoutSessionSchema } from "./schema";

export const createCheckoutSession = async (data: CreateCheckoutSessionSchema) => {
  if (!process.env.NEXT_STRIPE_SECRET_KEY) {
    throw new Error("Stripe secret key not found");
  }
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const { orderId } = createCheckoutSessionSchema.parse(data);
  const order = await db.query.orderTable.findFirst({
    where: (orderTable, { eq }) => eq(orderTable.id, orderId),
  });
  if (!order) {
    throw new Error("Order not found");
  }
  if (order.userId !== session.user.id) {
    throw new Error("Unauthorized");
  }

  const orderItems = await db.query.orderItemTable.findMany({
    where: (orderItemTable, { eq }) => eq(orderItemTable.orderId, orderId),
    with: {
      productVariant: {
        with: {
          product: true,
        }
      },
    }
  });
  const stripe = new Stripe(process.env.NEXT_STRIPE_SECRET_KEY);
  const checkoutSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: 'payment',
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/cancel`,
    metadata: {
      orderId,
    },
    line_items: orderItems.map(orderItem => ({
      price_data: {
        currency: 'brl',
        product_data: {
          name: `${orderItem.productVariant.product.name} - ${orderItem.productVariant.name}`,
          description: orderItem.productVariant.product.description,
          images: [orderItem.productVariant.imageUrl.replace(/[{}"]/g, '')],
        },
        unit_amount: orderItem.productVariant.priceInCents,
      },
      quantity: orderItem.quantity,
    })),
  });
  return checkoutSession;
}