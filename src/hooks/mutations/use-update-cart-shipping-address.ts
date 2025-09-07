import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateCartShippingAddress } from "@/actions/update-cart-shipping-address";
import { UpdateCartShippingAddressSchema } from "@/actions/update-cart-shipping-address/schema";

export const useUpdateCartShippingAddressMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCartShippingAddressSchema) => updateCartShippingAddress(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};
