import { useQuery } from "@tanstack/react-query";

import { getUserAddresses } from "@/actions/get-user-addresses";
import { shippingAddressTable } from "@/db/schema";

export const getUseAddressesQueryKey = () => ["addresses"] as const;

export const useAddresses = (params?: {
  initialData?: (typeof shippingAddressTable.$inferSelect)[];
}) => {
  return useQuery({
    queryKey: getUseAddressesQueryKey(),
    queryFn: async () => {
      const result = await getUserAddresses();
      return result.data;
    },
    initialData: params?.initialData,
  });
};
