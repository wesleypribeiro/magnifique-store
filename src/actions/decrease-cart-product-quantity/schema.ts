import { z } from "zod";

export const decreaseCartProductQuantitySchema = z.object({
  cartItemId: z.string(),
});

export type DecreaseCartProductQuantitySchema = z.infer<typeof decreaseCartProductQuantitySchema>;