import Image from "next/image";
import Header from "../components/common/header";
import { db } from "@/db";
import ProductList from "@/components/common/product-list";
import CategorySelector from "@/components/common/category-selector";

const Home = async () => {
  const products = await db.query.productTable.findMany({
    with: {
      variants: true
    }
  });
  const categories = await db.query.categoryTable.findMany({})

  return (
    <>
      <Header />
      <div className="space-y-6">
        <div className="px-5">
          <Image src="/banner-01.png"
            alt="Leve uma vida com estilo"
            height={0}
            width={0}
            sizes="100vw"
            className="w-full h-auto"
          />

        </div>
        <ProductList products={products} title="Mais vendidos" />

        <div className="px-5">
          <CategorySelector categories={categories} />
        </div>

        <div className="px-5">
          <Image src="/banner-02.png"
            alt="Leve uma vida com estilo"
            height={0}
            width={0}
            sizes="100vw"
            className="w-full h-auto"
          />
        </div>
      </div>
    </>
  );
}

export default Home;