import Image from "next/image";
import Link from "next/link";

import { productTable, productVariantTable } from "@/db/schema";
import { cn } from "@/lib/utils";
import { formatCentsToBRL } from "@/utils/money";

interface ProductItemProps {
  product: (typeof productTable.$inferSelect) & {
    variants: (typeof productVariantTable.$inferSelect)[];
  };
  textContainerClassName?: string;
}


const ProductItem = ({ product, textContainerClassName }: ProductItemProps) => {
  const firstVariant = product.variants[0]
  return (
    <Link href={`/product-variant/${firstVariant.slug}`} className="flex flex-col gap-4">
      <Image
        src={firstVariant.imageUrl.replace(/[{}"]/g, '')}
        alt={firstVariant.name}
        sizes="100vw"
        width={0}
        height={0}
        className="h-auto w-full rounded-3xl"
      />
      <div className={cn("flex flex-col gap-1 max-w-[200px]", textContainerClassName)}>
        <p className="truncate text-sm font-medium">{product.name}</p>
        <p className="truncate text-xs text-muted-foreground font-medium">{product.description}</p>
        <p className="truncate text-sm font-semibold">
          {formatCentsToBRL(firstVariant.priceInCents)}
        </p>
      </div>
    </Link>
  );
}

export default ProductItem;