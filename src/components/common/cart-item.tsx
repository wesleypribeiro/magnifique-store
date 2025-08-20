import Image from "next/image";
import { Button } from "../ui/button";
import { MinusIcon, PlusIcon, TrashIcon } from "lucide-react";
import { formatCentsToBRL } from "@/utils/money";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeProductFromCart } from "@/actions/remove-cart-product";
import { toast } from "sonner";
import { decreaseCartProductQuantity } from "@/actions/decrease-cart-product-quantity";

interface CartItemProps {
  id: string;
  productName: string;
  productVariantName: string;
  productVariantImageUrl: string;
  productVariantPriceInCents: number;
  quantity: number;
}

const CartItem = ({
  id,
  productName,
  productVariantName,
  productVariantImageUrl,
  productVariantPriceInCents,
  quantity
}: CartItemProps) => {
  const queryClient = useQueryClient();
  const removeProductFromCartMutation = useMutation({
    mutationKey: ['remove-cart-product'],
    mutationFn: () => removeProductFromCart({ cartItemId: id }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['cart'],
      })
    },
  })
  const decreaseProductQuantityMutation = useMutation({
    mutationKey: ['decrease-product-quantity'],
    mutationFn: () => decreaseCartProductQuantity({ cartItemId: id }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['cart'],
      })
    },
  })
  const handleDeleteClick = () => {
    removeProductFromCartMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success(`Produto removido do carrinho`)
      },
      onError: () => {
        toast.error(`Erro ao remover produto do carrinho`)
      }
    });
  }
  const handleDecreaseQuantityClick = () => {
    decreaseProductQuantityMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success(`Quantidade do produto diminuída`)
      },
      onError: () => {
        toast.error(`Erro ao diminuir quantidade do produto`)
      }
    });
  }
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Image
          src={productVariantImageUrl.replace(/[{}"]/g, '')}
          alt={productVariantName}
          width={78}
          height={78}
          className="rounded-lg"
        />
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold">{productName}</p>
          <p className="text-xs font-medium text-muted-foreground">{productVariantName}</p>
          <div className="flex items-center border justify-between rounded-lg w-[100px] p-1">
            <Button className="h-4 w-4" variant="ghost" onClick={handleDecreaseQuantityClick}><MinusIcon size={12} /></Button>
            <p className="text-xs font-medium">{quantity}</p>
            <Button className="h-4 w-4" variant="ghost" onClick={() => {}}><PlusIcon size={12} /></Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center items-end gap-2">
        <Button variant="outline" size="icon" onClick={handleDeleteClick}>
          <TrashIcon />
        </Button>
        <p className="text-sm font-bold">{formatCentsToBRL(productVariantPriceInCents)}</p>
      </div>
    </div>
  );
}
 
export default CartItem;