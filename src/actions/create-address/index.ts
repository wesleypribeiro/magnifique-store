'use server';

import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

import { db } from '@/db';
import { shippingAddressTable } from '@/db/schema';
import { auth } from '@/lib/auth';

import { type CreateAddressInput,createAddressSchema } from './schema';

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