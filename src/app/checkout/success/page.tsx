"use client";

import Header from "@/components/common/header";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import Image from "next/image";
import Link from "next/link";

const SuccessPage = () => {
  return (
    <>
      <Header />
      <Dialog open={true} onOpenChange={() => { }}>
        <DialogContent className="text-center">
          <Image
            src="/illustration.svg"
            alt="Success"
            width={300}
            height={300}
            className="mx-auto"
          />
          <DialogTitle className="text-2xl mt-4">Pedido efetuado!</DialogTitle>
          <DialogDescription className="font-medium">
            Seu pedido foi efetuado com sucesso. Você pode acompanhar o status na seção de “Meus Pedidos”.
          </DialogDescription>
          <DialogFooter>
            <Button className="rounded-full" size="lg">Ver meus pedidos</Button>
            <Button
              className="rounded-full"
              size="lg"
              variant="outline"
              asChild
            >
              <Link href="/">Voltar para a loja</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default SuccessPage;