import { desc } from "drizzle-orm";
import Image from "next/image";

import CategorySelector from "@/components/common/category-selector";
import Footer from "@/components/common/footer";
import ProductList from "@/components/common/product-list";
import { db } from "@/db";
import { productTable } from "@/db/schema";

import Header from "../components/common/header";
import Link from "next/link";

const Home = async () => {
  const products = await db.query.productTable.findMany({
    with: {
      variants: true
    }
  });
  const newlyCreatedProducts = await db.query.productTable.findMany({
    orderBy: [desc(productTable.createdAt)],
    with: {
      variants: true
    }
  });
  const categories = await db.query.categoryTable.findMany({});

  return (
    <>
      <Header />
      <div className="space-y-6 max-w-[1440px] mx-auto">
        <div className="hidden md:flex items-center justify-around gap-4 px-5 pt-4">
          {categories.map(category => (
            <Link className="text-lg font-medium" key={category.id} href={`/category/${category.id}`}>
              {category.name}
            </Link>
          ))}
        </div>
        <div className="px-5 md:hidden">
          <Image src="/banner-01.png"
            alt="Leve uma vida com estilo"
            height={0}
            width={0}
            sizes="100vw"
            className="w-full h-auto"
          />
        </div>
        <div className="px-5 md:block">
          <Image src="/banner-01-desktop.png"
            alt="Leve uma vida com estilo"
            height={0}
            width={0}
            sizes="100vw"
            className="w-full h-auto"
          />
        </div>
        <ProductList products={products} title="Mais vendidos" />

        <div className="md:hidden px-5">
          <CategorySelector categories={categories} />
        </div>

        <div className="md:hidden px-5">
          <Image src="/banner-02.png"
            alt="Leve uma vida com estilo"
            height={0}
            width={0}
            sizes="100vw"
            className="w-full h-auto"
          />
        </div>

        <div className="px-5 hidden md:block">
          <div className="flex h-full items-center">
            <div className="flex flex-col gap-2 w-4/6 p-4 h-full">
              <Image src="/banner-03.png"
                alt="Leve uma vida com estilo"
                height={0}
                width={0}
                sizes="100vw"
                className="w-full h-1/2 rounded-3xl"
              />
               <Image src="/banner-04.png"
                alt="Leve uma vida com estilo"
                height={0}
                width={0}
                sizes="100vw"
                className="w-full h-1/2 rounded-3xl"
              />
            </div>
             <Image src="/banner-05.png"
                alt="Leve uma vida com estilo"
                height={0}
                width={0}
                sizes="100vw"
                className="w-full h-full rounded-3xl"
              />
          </div>
        </div>

        <div className="md:hidden">
          <ProductList products={newlyCreatedProducts} title="Novos produtos" />
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Home;