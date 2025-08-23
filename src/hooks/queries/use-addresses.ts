import { useQuery } from "@tanstack/react-query";
import { getUserAddresses } from "@/actions/get-user-addresses";

export const getUseAddressesQueryKey = () => ["addresses"] as const;

export const useAddresses = () => {
  return useQuery({
    queryKey: getUseAddressesQueryKey(),
    queryFn: () => getUserAddresses()
  });
};
