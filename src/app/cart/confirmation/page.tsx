import Footer from "@/components/common/footer";
import Header from "@/components/common/header";
import { db } from "@/db";
import { shippingAddressTable } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import CartSummary from "../components/cart-summary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Address from "../helpers/address";
import FinishOrderButton from "./components/finish-order-button";

const ConfirmationPage = async () => {
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
  if (!cart.shippingAddress) {
    redirect("/cart/identification")
  }
  return (
    <div className="space-y-12">
      <Header />
      <div className="space-y-4 px-5">
        <Card>
          <CardHeader>
            <CardTitle>Identificação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Card>
              <CardContent>
                <Address address={cart.shippingAddress} />
              </CardContent>
            </Card>
            <FinishOrderButton />
          </CardContent>
        </Card>
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
      <div className="mt-12">
        <Footer />
      </div>
    </div>
  );
}
 
export default ConfirmationPage;