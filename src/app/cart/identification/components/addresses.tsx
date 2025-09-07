"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { PatternFormat } from "react-number-format";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { shippingAddressTable } from "@/db/schema";
import { useCreateAddressMutation } from "@/hooks/mutations/use-create-address";
import { useUpdateCartShippingAddressMutation } from "@/hooks/mutations/use-update-cart-shipping-address";
import { useAddresses } from "@/hooks/queries/use-addresses";

import Address from "../../helpers/address";

const StyledInput = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ ...props }, ref) => (
    <input
      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      ref={ref}
      {...props}
    />
  )
);

StyledInput.displayName = "StyledInput";

// Helper to remove non-digit characters
const removeNonDigits = (value: string) => value.replace(/\D/g, '');

const formSchema = z.object({
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
    .transform(val => val.toUpperCase()),
});

type FormValues = z.infer<typeof formSchema>;

interface AddressesProps {
  shippingAddresses: (typeof shippingAddressTable.$inferSelect)[];
  defaultShippingAddressId: string | null;
}

const Addresses = ({ shippingAddresses, defaultShippingAddressId }: AddressesProps) => {
  const router = useRouter();
  const [selectedAddress, setSelectedAddress] = useState<string | null>(defaultShippingAddressId || null);
  const { data: addressesData, isLoading: isLoadingAddresses } = useAddresses({initialData: shippingAddresses});
  const createAddressMutation = useCreateAddressMutation();
  const updateCartShippingAddressMutation = useUpdateCartShippingAddressMutation();
  
  const addresses = addressesData || [];

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      fullName: "",
      cpf: "",
      phone: "",
      zipCode: "",
      address: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
    },
  });

  const onSubmit = async (formData: FormValues) => {
    try {
      // Format the data before sending to the server
      const formattedData = {
        ...formData,
        cpf: removeNonDigits(formData.cpf),
        phone: removeNonDigits(formData.phone),
        zipCode: removeNonDigits(formData.zipCode),
        state: formData.state.toUpperCase(),
      };
      
      const result = await createAddressMutation.mutateAsync(formattedData);
      
      // Update cart with the new shipping address
      await updateCartShippingAddressMutation.mutateAsync({
        shippingAddressId: result.data.id
      });
      
      toast.success("Endereço cadastrado e vinculado ao carrinho com sucesso!");
      form.reset();
      setSelectedAddress(null);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error("Ocorreu um erro ao salvar o endereço. Tente novamente.");
    }
  };

  const handleGoToPayment = async () => {
    if (!selectedAddress || selectedAddress === "add_new") {
      toast.error("Selecione um endereço para continuar");
      return;
    }

    try {
      await updateCartShippingAddressMutation.mutateAsync({
        shippingAddressId: selectedAddress
      });
      
      toast.success("Endereço vinculado ao carrinho com sucesso!");
      router.push("/cart/confirmation");
    } catch (error) {
      console.error('Error updating cart shipping address:', error);
      toast.error("Ocorreu um erro ao vincular o endereço. Tente novamente.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Identificação</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup 
          value={selectedAddress || ""} 
          onValueChange={setSelectedAddress}
          className="space-y-4"
        >
          {isLoadingAddresses ? (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="ml-2">Carregando endereços...</span>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {addresses.map((address) => (
                <Card key={address.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start space-x-2">
                      <RadioGroupItem value={address.id} id={address.id} className="mt-1" />
                      <div className="flex-1">
                        <Label htmlFor={address.id} className="cursor-pointer">
                          <Address address={address} />
                        </Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="add_new" id="add_new" />
                    <Label htmlFor="add_new">Adicionar novo endereço</Label>
                  </div>
                </CardContent>
              </Card>
              {selectedAddress && selectedAddress !== "add_new" && (
                <div className="flex pt-4">
                  <Button 
                    onClick={handleGoToPayment}
                    disabled={updateCartShippingAddressMutation.isPending}
                    className="w-full"
                  >
                    {updateCartShippingAddressMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      'Ir para pagamento'
                    )}
                  </Button>
                </div>
              )}
            </>
          )}

          {selectedAddress === "add_new" && (
            <Card>
              <CardContent className="pt-6">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>E-mail</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="seu@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome completo</FormLabel>
                            <FormControl>
                              <Input placeholder="Seu nome completo" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="cpf"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CPF</FormLabel>
                            <FormControl>
                              <PatternFormat
                                format="###.###.###-##"
                                mask={'_'}
                                placeholder="000.000.000-00"
                                value={field.value}
                                onValueChange={(values) => {
                                  field.onChange(values.formattedValue);
                                }}
                                customInput={StyledInput}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Celular</FormLabel>
                            <FormControl>
                              <PatternFormat
                                format="(##) #####-####"
                                mask={'_'}
                                placeholder="(00) 00000-0000"
                                value={field.value}
                                onValueChange={(values) => {
                                  field.onChange(values.formattedValue);
                                }}
                                customInput={StyledInput}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="zipCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CEP</FormLabel>
                            <FormControl>
                              <PatternFormat
                                format="#####-###"
                                mask={'_'}
                                placeholder="00000-000"
                                value={field.value}
                                onValueChange={(values) => {
                                  field.onChange(values.formattedValue);
                                }}
                                customInput={StyledInput}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Endereço</FormLabel>
                            <FormControl>
                              <Input placeholder="Rua, Avenida, etc." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="number"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Número</FormLabel>
                            <FormControl>
                              <Input placeholder="123" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="complement"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Complemento</FormLabel>
                            <FormControl>
                              <Input placeholder="Apto, bloco, etc. (opcional)" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="neighborhood"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bairro</FormLabel>
                            <FormControl>
                              <Input placeholder="Seu bairro" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cidade</FormLabel>
                            <FormControl>
                              <Input placeholder="Sua cidade" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="state"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Estado (UF)</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="SP" 
                                maxLength={2}
                                className="uppercase"
                                {...field} 
                                onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button 
                        type="submit" 
                        disabled={createAddressMutation.isPending || updateCartShippingAddressMutation.isPending}
                      >
                        {(createAddressMutation.isPending || updateCartShippingAddressMutation.isPending) ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Salvando...
                          </>
                        ) : (
                          'Salvar Endereço'
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          )}
        </RadioGroup>
      </CardContent>
    </Card>
  );
}

 
export default Addresses;