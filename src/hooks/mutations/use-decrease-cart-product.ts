import { useMutation, useQueryClient } from "@tanstack/react-query"
import { getUseCartQueryKey } from "../queries/use-cart";
import { decreaseCartProductQuantity } from "@/actions/decrease-cart-product-quantity";

export const getDecreaseCartProductMutationKey = (cartItemId: string) => ['decrease-cart-product', cartItemId] as const;

export const useDecreaseCartProductMutation = (cartItemId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: getDecreaseCartProductMutationKey(cartItemId),
    mutationFn: () => decreaseCartProductQuantity({ cartItemId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getUseCartQueryKey(),
      })
    },
  })
}