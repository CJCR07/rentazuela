"use client";

import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center bg-background text-foreground">
          <div className="mb-8">
            <span className="text-8xl font-black tracking-tighter text-red-500">Error</span>
          </div>
          
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Error crítico
          </h1>
          
          <p className="mt-4 max-w-md text-muted-foreground">
            Ha ocurrido un error grave en la aplicación. 
            Por favor, recarga la página o vuelve más tarde.
          </p>
          
          <button
            onClick={() => reset()}
            className="mt-8 rounded-lg bg-red-500 px-6 py-3 font-bold text-white hover:bg-red-600 transition-colors"
          >
            Recargar aplicación
          </button>
        </div>
      </body>
    </html>
  );
}
