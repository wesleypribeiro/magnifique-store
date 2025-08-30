"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { cartItemTable, cartTable, orderItemTable, orderTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

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
  let orderId: string | undefined;
  await db.transaction(async (tx) => {
    if (!cart.shippingAddress) {
      throw new Error("Shipping address not found");
    }
    const [order] = await tx.insert(orderTable).values({
      city: cart.shippingAddress.city,
      state: cart.shippingAddress.state,
      neighborhood: cart.shippingAddress.neighborhood,
      zipCode: cart.shippingAddress.zipCode,
      recipientName: cart.shippingAddress.recipientName,
      street: cart.shippingAddress.street,
      number: cart.shippingAddress.number,
      complement: cart.shippingAddress.complement,
      userId: session.user.id,
      email: cart.shippingAddress.email,
      phone: cart.shippingAddress.phone,
      cpfOrCnpj: cart.shippingAddress.cpfOrCnpj,
      country: cart.shippingAddress.country,
      totalPriceInCents,
      shippingAddressId: cart.shippingAddress!.id,
    }).returning();
    if (!order) {
      throw new Error("Failed to create order");
    }
    orderId = order.id;
    const orderItemsPayload: Array<typeof orderItemTable.$inferInsert> = cart.items.map(item => ({
      orderId: order.id,
      productVariantId: item.productVariant.id,
      quantity: item.quantity,
      priceInCents: item.productVariant.priceInCents,
    }))
    await tx.insert(orderItemTable).values(orderItemsPayload);
    await tx.delete(cartTable).where(eq(cartTable.id, cart.id));
    await tx.delete(cartItemTable).where(eq(cartItemTable.cartId, cart.id));
  });
  if (!orderId) {
    throw new Error("Failed to create order");
  }
  return { orderId };
}