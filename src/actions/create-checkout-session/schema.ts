import { z } from "zod";

export const createCheckoutSessionSchema = z.object({
  orderId: z.string()
});

export type CreateCheckoutSessionSchema = z.infer<typeof createCheckoutSessionSchema>;