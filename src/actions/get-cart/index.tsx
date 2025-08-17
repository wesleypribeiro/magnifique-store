"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { cartTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export const getCart = async () => {
  const session = await auth.api.getSession({
    headers: await headers()
  })

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const cart = await db.query.cartTable.findFirst({
    where: (cart, { eq }) => eq(cart.userId, session.user.id),
    with: {
      items: {
        with: {
          productVariant: true,
        }
      }
    }
  });

  if (!cart) {
    const [newCart] = await db.insert(cartTable).values({
      userId: session.user.id,
    }).returning();
    return {
      ...newCart,
      items: [],
    };
  }

  return cart;
}
