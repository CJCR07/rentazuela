"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mail, ArrowRight } from "lucide-react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-background">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="flex justify-center">
          <div className="h-16 w-16 rounded-full bg-brand/10 flex items-center justify-center">
            <Mail className="h-8 w-8 text-brand" />
          </div>
        </div>

        <h1 className="text-3xl font-black tracking-tight text-foreground">
          Verifica tu correo
        </h1>

        <p className="text-muted-foreground">
          Hemos enviado un enlace de verificación a{" "}
          {email ? (
            <strong className="text-foreground">{email}</strong>
          ) : (
            "tu correo"
          )}
          . Haz clic en el enlace para activar tu cuenta.
        </p>

        <div className="bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
          <p>
            ¿No recibiste el correo? Revisa tu carpeta de spam o solicita un
            nuevo enlace.
          </p>
        </div>

        <div className="space-y-3">
          <Link href="/auth/login">
            <Button className="w-full bg-brand hover:bg-brand/90">
              Ir al inicio de sesión
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>

          <p className="text-sm text-muted-foreground">
            ¿El correo no llegó?{" "}
            <button
              onClick={() => window.location.reload()}
              className="text-brand hover:underline font-medium"
            >
              Reenviar
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-brand border-t-transparent rounded-full" /></div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
