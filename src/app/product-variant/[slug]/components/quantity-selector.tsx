"use client";

import { Button } from "@/components/ui/button";
import { MinusIcon, PlusIcon } from "lucide-react";
import { useState } from "react";

const QuantitySelector = ({initialQuantity}: {initialQuantity: number}) => {

  const [quantity, setQuantity] = useState(initialQuantity);

  const handleDecrement = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : prev));
  }

  const handleIncrement = () => {
    setQuantity(prev => prev + 1);
  }

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Quantidade</h3>
      <div className="flex items-center border justify-between rounded-lg w-[100px]">
        <Button size="icon" variant="ghost" onClick={handleDecrement}><MinusIcon /></Button>
        <p>{quantity}</p>
        <Button size="icon" variant="ghost" onClick={handleIncrement}><PlusIcon /></Button>
      </div>
    </div>
  );
}
 
export default QuantitySelector;