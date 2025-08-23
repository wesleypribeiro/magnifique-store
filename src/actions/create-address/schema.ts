import { z } from "zod";

// Helper to remove non-digit characters
const removeNonDigits = (value: string) => value.replace(/\D/g, '');

export const createAddressSchema = z.object({
  email: z.email("E-mail inválido").min(1, "E-mail é obrigatório"),
  fullName: z.string().min(1, "Nome completo é obrigatório"),
  cpf: z.string()
    .min(1, "CPF é obrigatório")
    .refine(val => removeNonDigits(val).length === 11, {
      message: "CPF deve ter 11 dígitos"
    }),
  phone: z.string()
    .min(1, "Celular é obrigatório")
    .refine(val => removeNonDigits(val).length === 11, {
      message: "Celular deve ter 11 dígitos (DDD + número)"
    }),
  zipCode: z.string()
    .min(1, "CEP é obrigatório")
    .refine(val => removeNonDigits(val).length === 8, {
      message: "CEP deve ter 8 dígitos"
    }),
  address: z.string().min(1, "Endereço é obrigatório"),
  number: z.string().min(1, "Número é obrigatório"),
  complement: z.string().optional(),
  neighborhood: z.string().min(1, "Bairro é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatória"),
  state: z.string()
    .min(2, "Estado é obrigatório")
    .max(2, "UF deve ter 2 caracteres")
    .toUpperCase(),
});

export type CreateAddressInput = z.infer<typeof createAddressSchema>;
