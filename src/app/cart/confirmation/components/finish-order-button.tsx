"use client";

import { Button } from "@/components/ui/button";
import { useFinishOrder } from "@/hooks/mutations/use-finish-order";
import { Loader2 } from "lucide-react";
import { createCheckoutSession } from "@/actions/create-checkout-session";
import { loadStripe } from '@stripe/stripe-js';

const FinishOrderButton = () => {
  const finishOrderMutation = useFinishOrder();
  const handleFinishOrder = async () => {
    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      throw new Error("Stripe publishable key not found");
    }
    const { orderId } = await finishOrderMutation.mutateAsync();
    const checkoutSession = await createCheckoutSession({
      orderId,
    })
    const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
    if (!stripe) {
      throw new Error("Stripe.js failed to load");
    }
    await stripe.redirectToCheckout({
      sessionId: checkoutSession.id
    })
  }
  return (
    <>
    <Button
      className="w-full rounded-full"
      size="lg"
      onClick={handleFinishOrder}
      disabled={finishOrderMutation.isPending}
    >
      {finishOrderMutation.isPending && (
        <Loader2 className="h-4 w-4 animate-spin" />
      )}
      Finalizar compra
    </Button>
    </>
  );
}
 
export default FinishOrderButton;