"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-8">
        <span className="text-8xl font-black tracking-tighter text-brand">404</span>
      </div>
      
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Página no encontrada
      </h1>
      
      <p className="mt-4 max-w-md text-muted-foreground">
        Lo sentimos, no pudimos encontrar la página que estás buscando. 
        Es posible que haya sido movida o eliminada.
      </p>
      
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild className="bg-brand hover:bg-brand/90">
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Volver al inicio
          </Link>
        </Button>
        
        <Button variant="outline" onClick={() => window.history.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver atrás
        </Button>
      </div>
    </div>
  );
}
