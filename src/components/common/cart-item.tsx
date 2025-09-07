import { MinusIcon, PlusIcon, TrashIcon } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

import { useDecreaseCartProductMutation } from "@/hooks/mutations/use-decrease-cart-product";
import { useIncreaseCartProductMutation } from "@/hooks/mutations/use-increase-cart-product";
import { useRemoveProductFromCart } from "@/hooks/mutations/use-remove-product-from-cart";
import { formatCentsToBRL } from "@/utils/money";

import { Button } from "../ui/button";

interface CartItemProps {
  id: string;
  productName: string;
  productVariantId: string;
  productVariantName: string;
  productVariantImageUrl: string;
  productVariantPriceInCents: number;
  quantity: number;
}

const CartItem = ({
  id,
  productName,
  productVariantId,
  productVariantName,
  productVariantImageUrl,
  productVariantPriceInCents,
  quantity
}: CartItemProps) => {
  const removeProductFromCartMutation = useRemoveProductFromCart(id);
  const decreaseProductQuantityMutation = useDecreaseCartProductMutation(id);
  const increaseProductQuantityMutation = useIncreaseCartProductMutation(productVariantId);
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
  const handleIncreaseQuantityClick = () => {
    increaseProductQuantityMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success(`Quantidade do produto aumentada`)
      },
      onError: () => {
        toast.error(`Erro ao aumentar quantidade do produto`)
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
            <Button className="h-4 w-4" variant="ghost" onClick={handleIncreaseQuantityClick}><PlusIcon size={12} /></Button>
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