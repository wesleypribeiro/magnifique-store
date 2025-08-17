import { productVariantTable } from "@/db/schema";
import Image from "next/image";
import Link from "next/link";

interface VariantSelectorProps {
  selectedVariantSlug: string;
  variants: (typeof productVariantTable.$inferSelect)[];   
}

const VariantSelector = ({selectedVariantSlug, variants}: VariantSelectorProps) => {
  return (
    <div className="flex items-center gap-4">
      {variants.map((variant) => (
        <Link
          href={`/product-variant/${variant.slug}`}
          key={variant.id}
          className={selectedVariantSlug === variant.slug ? "border-primary border-2 border-solid rounded-xl" : ""}
        >
          <Image width={68} height={68} src={variant.imageUrl.replace(/[{}"]/g, '')} alt={variant.name} className="rounded-xl" />
        </Link>
      ))}
    </div>
  );
}
 
export default VariantSelector;