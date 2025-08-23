import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getUseAddressesQueryKey } from "../queries/use-addresses";
import { createAddress } from "@/actions/create-address";
import { CreateAddressInput } from "@/actions/create-address/schema";

export const getCreateAddressMutationKey = () => ['create-address'] as const;

export const useCreateAddressMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: getCreateAddressMutationKey(),
    mutationFn: (data: CreateAddressInput) => createAddress(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getUseAddressesQueryKey(),
      });
    },
  });
};
