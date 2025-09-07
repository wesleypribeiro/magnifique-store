'use server';

import { eq } from 'drizzle-orm';
import { headers } from 'next/headers';

import { db } from '@/db';
import { shippingAddressTable } from '@/db/schema';
import { auth } from '@/lib/auth';

export const getUserAddresses = async () => {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const addresses = await db
    .select()
    .from(shippingAddressTable)
    .where(eq(shippingAddressTable.userId, session.user.id));

  return {
    data: addresses,
  };
};
