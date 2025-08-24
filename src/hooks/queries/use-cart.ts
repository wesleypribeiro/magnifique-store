import { useQuery } from "@tanstack/react-query";
import { getCart } from "@/actions/get-cart";

export const getUseCartQueryKey = () => ["cart"] as const;

interface UseCartProps {
  initialData?: Awaited<ReturnType<typeof getCart>>;
}

export const useCart = ({ initialData }: UseCartProps = {}) => {
  return useQuery({
    queryKey: getUseCartQueryKey(),
    queryFn: () => getCart(),
    initialData
  });
}