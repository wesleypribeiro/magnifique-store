import { db } from "@/db";
import { cartTable, shippingAddressTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Header from "@/components/common/header";
import Addresses from "./components/addresses";
import CartSummary from "../components/cart-summary";
import Footer from "@/components/common/footer";

const IdentificationPage = async () => {
  const session = await auth.api.getSession({
    headers: await headers()
  })
  if (!session?.user.id) {
    redirect("/")
  }
    
  const cart = await db.query.cartTable.findFirst({
    where: (cart, { eq }) => eq(cart.userId, session.user.id),
    with: {
      shippingAddress: true,
      items: {
        with: {
          productVariant: {
            with: {
              product: true,
            }
          },
        }
      }
    }
  });
  if (!cart || cart.items.length === 0) {
    redirect("/")
  }
  const shippingAddresses = await db.query.shippingAddressTable.findMany({
    where: eq(shippingAddressTable.userId, session.user.id),
  });
  const cartTotalInCents = cart.items.reduce((total, item) => total + item.productVariant.priceInCents * item.quantity, 0)
  return (
    <div className="space-y-12">
      <Header />
      <div className="px-5 space-y-4">
        <Addresses shippingAddresses={shippingAddresses} defaultShippingAddressId={cart?.shippingAddress?.id || null} />
        <CartSummary
          subtotalInCents={cartTotalInCents}
          totalInCents={cartTotalInCents}
          products={cart.items.map(item => ({
            id: item.id,
            name: item.productVariant.product.name,
            variantName: item.productVariant.name,
            quantity: item.quantity,
            priceInCents: item.productVariant.priceInCents,
            imageUrl: item.productVariant.imageUrl,
          }))}
        />

      </div>
      <Footer />
    </div>
  );
}
 
export default IdentificationPage;