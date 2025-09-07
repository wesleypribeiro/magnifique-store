import { shippingAddressTable } from "@/db/schema";

const Address = ({ address }: { address: typeof shippingAddressTable.$inferSelect }) => {
  return (
    <div className="space-y-1">
      <div className="font-medium">{address.recipientName}</div>
      <div className="text-sm text-muted-foreground">
        {address.street}, {address.number}
        {address.complement && `, ${address.complement}`}
      </div>
      <div className="text-sm text-muted-foreground">
        {address.neighborhood}, {address.city} - {address.state}
      </div>
      <div className="text-sm text-muted-foreground">
        CEP: {address.zipCode.replace(/(\d{5})(\d{3})/, '$1-$2')}
      </div>
    </div>
  );
}
 
export default Address;