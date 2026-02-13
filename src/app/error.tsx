"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RefreshCw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-8">
        <span className="text-8xl font-black tracking-tighter text-brand">500</span>
      </div>
      
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        Algo salió mal
      </h1>
      
      <p className="mt-4 max-w-md text-muted-foreground">
        Ha ocurrido un error inesperado. Nuestro equipo ha sido notificado 
        y estamos trabajando para solucionarlo.
      </p>
      
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button onClick={() => reset()} className="bg-brand hover:bg-brand/90">
          <RefreshCw className="mr-2 h-4 w-4" />
          Intentar de nuevo
        </Button>
        
        <Button variant="outline" asChild>
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Volver al inicio
          </Link>
        </Button>
      </div>
    </div>
  );
}
