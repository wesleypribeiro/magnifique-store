import { productTable, productVariantTable } from "@/db/schema";
import { formatCentsToBRL } from "@/utils/money";
import Image from "next/image";
import Link from "next/link";

interface ProductItemProps {
  product: (typeof productTable.$inferSelect) & {
    variants: (typeof productVariantTable.$inferSelect)[];
  };
}


const ProductItem = ({ product }: ProductItemProps) => {
  const firstVariant = product.variants[0]
  return (
    <Link href="/" className="flex flex-col gap-4">
      <Image
        src={firstVariant.imageUrl.replace(/[{}"]/g, '')}
        alt={firstVariant.name}
        width={200}
        height={200}
        className="rounded-3xl"
      />
      <div className="flex flex-col gap-1 max-w-[200px]">
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