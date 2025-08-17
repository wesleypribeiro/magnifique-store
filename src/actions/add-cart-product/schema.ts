import { z } from "zod";

export const addProductToCartSchema = z.object({
    productVariantId: z.uuid(),
    quantity: z.number().min(1, "Quantidade inválida"),
});

export type AddProductToCartSchema = z.infer<typeof addProductToCartSchema>;
