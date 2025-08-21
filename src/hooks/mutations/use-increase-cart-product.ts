import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getUseCartQueryKey } from "../queries/use-cart";
import { addProductToCart } from "@/actions/add-cart-product";

export const getIncreaseCartProductMutationKey = (productVariantId: string) => ['increase-cart-product', productVariantId] as const;

export const useIncreaseCartProductMutation = (productVariantId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: getIncreaseCartProductMutationKey(productVariantId),
    mutationFn: () => addProductToCart({ productVariantId, quantity: 1 }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getUseCartQueryKey(),
      });
    },
  });
}
