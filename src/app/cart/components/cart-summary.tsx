import Image from "next/image";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCentsToBRL } from "@/utils/money";

interface CartSummaryProps {
  subtotalInCents: number;
  totalInCents: number;
  products: Array<{
    id: string;
    name: string;
    variantName: string;
    quantity: number;
    priceInCents: number;
    imageUrl: string;
  }>;
}

const CartSummary = ({ subtotalInCents, totalInCents, products }: CartSummaryProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Resumo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between">
          <p className="text-sm">Subtotal</p>
          <p className="text-sm text-muted-foreground font-medium">
            {formatCentsToBRL(subtotalInCents)}
          </p>
        </div>
        <div className="flex justify-between">
          <p className="text-sm">Frete</p>
          <p className="text-sm text-muted-foreground font-medium">
            GRÁTIS
          </p>
        </div>
        <div className="flex justify-between">
          <p className="text-sm">Total</p>
          <p className="text-sm text-muted-foreground font-medium">
            {formatCentsToBRL(totalInCents)}
          </p>

        </div>
        <div className="py-3">
          <Separator />
        </div>
        {products.map(product => (
          <div className="flex items-center justify-between" key={product.id}>
            <div className="flex items-center gap-4">
              <Image
                src={product.imageUrl.replace(/[{}"]/g, '')}
                alt={product.variantName}
                width={78}
                height={78}
                className="rounded-lg"
              />
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold">{product.name}</p>
                <p className="text-xs font-medium text-muted-foreground">{product.variantName}</p>
              </div>
            </div>
            <div className="flex flex-col justify-center items-end gap-2">
              <p className="text-sm font-bold">{formatCentsToBRL(product.priceInCents)}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
 
export default CartSummary;