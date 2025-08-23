'use server';

import { db } from '@/db';
import { shippingAddressTable } from '@/db/schema';
import { revalidatePath } from 'next/cache';
import { createAddressSchema, type CreateAddressInput } from './schema';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';

// Helper to remove non-digit characters
const removeNonDigits = (value: string) => value.replace(/\D/g, '');

export const createAddress = async (data: CreateAddressInput) => {
    createAddressSchema.parse(data);
    const session = await auth.api.getSession({
      headers: await headers()
    })

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const formattedData = {
      recipientName: data.fullName,
      street: data.address,
      number: data.number,
      complement: data.complement || null,
      city: data.city,
      state: data.state.toUpperCase(),
      neighborhood: data.neighborhood,
      zipCode: removeNonDigits(data.zipCode),
      country: 'Brasil',
      phone: removeNonDigits(data.phone),
      email: data.email,
      cpfOrCnpj: removeNonDigits(data.cpf),
      userId: session.user.id
    };

    const [newAddress] = await db
      .insert(shippingAddressTable)
      .values(formattedData)
      .returning();

    revalidatePath('/cart/identification');
    
    return {
      data: newAddress,
    };
}