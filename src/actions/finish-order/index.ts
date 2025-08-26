"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { cartItemTable, orderItemTable, orderTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export const finishOrder = async () => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const cart = await db.query.cartTable.findFirst({
    where: (cart, { eq }) => eq(cart.userId, session.user.id),
    with: {
      shippingAddress: true,
      items: {
        with: {
          productVariant: true
        }
      }
    }
  });

  if (!cart) {
    throw new Error("Cart not found");
  }

  if (!cart.shippingAddress) {
    throw new Error("Shipping address not found");
  }

  const totalPriceInCents = cart.items.reduce(
    (acc, item) => acc + item.productVariant.priceInCents * item.quantity,
    0
  );

  await db.transaction(async (tx) => {
    const [order] = await tx.insert(orderTable).values({
      ...cart.shippingAddress!,
      userId: session.user.id,
      totalPriceInCents,
      shippingAddressId: cart.shippingAddress!.id,
    }).returning();
    if (!order) {
      throw new Error("Failed to create order");
    }
    const orderItemsPayload: Array<typeof orderItemTable.$inferInsert> = cart.items.map(item => ({
      orderId: order.id,
      productVariantId: item.productVariant.id,
      quantity: item.quantity,
      priceInCents: item.productVariant.priceInCents,
    }))
    await tx.insert(orderItemTable).values(orderItemsPayload);
    await tx.delete(cartItemTable).where(eq(cartItemTable.cartId, cart.id));
  })
}