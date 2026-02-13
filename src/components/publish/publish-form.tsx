"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { usePublishForm } from "./use-publish-form";
import { CategoryStep } from "./steps/category-step";
import { BasicInfoStep } from "./steps/basic-info-step";
import { LocationStep } from "./steps/location-step";
import { DetailsStep } from "./steps/details-step";
import { ImagesStep } from "./steps/images-step";
import { PreviewStep } from "./steps/preview-step";
import { toast } from "sonner";

/* ── Step Configuration ─────────────────────────────────────── */

const STEPS = [
  { id: 0, title: "Categoría", description: "Tipo de anuncio" },
  { id: 1, title: "Información", description: "Título y descripción" },
  { id: 2, title: "Ubicación", description: "Dónde está ubicado" },
  { id: 3, title: "Características", description: "Detalles específicos" },
  { id: 4, title: "Imágenes", description: "Fotos del anuncio" },
  { id: 5, title: "Vista previa", description: "Revisar y publicar" },
];

/* ── Component ──────────────────────────────────────────────── */

export function PublishForm() {
  const router = useRouter();
  const form = usePublishForm();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [form.currentStep]);

  const handleSubmit = async () => {
    const result = await form.submit();
    
    if (result.success) {
      toast.success("¡Anuncio publicado!", {
        description: "Tu anuncio ha sido publicado exitosamente",
      });
      router.push(`/listing/${result.listingId}`);
    } else {
      toast.error("Error al publicar", {
        description: result.error || "Por favor intenta de nuevo",
      });
    }
  };

  const handleSaveDraft = () => {
    toast.success("Borrador guardado");
    router.push("/mis-anuncios");
  };

  const renderStep = () => {
    switch (form.currentStep) {
      case 0:
        return <CategoryStep form={form} />;
      case 1:
        return <BasicInfoStep form={form} />;
      case 2:
        return <LocationStep form={form} />;
      case 3:
        return <DetailsStep form={form} />;
      case 4:
        return <ImagesStep form={form} />;
      case 5:
        return <PreviewStep form={form} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="mx-auto max-w-3xl px-4">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {STEPS.map((step, index) => (
              <div
                key={step.id}
                className="flex-1 flex flex-col items-center"
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors",
                    index < form.currentStep
                      ? "bg-brand text-white"
                      : index === form.currentStep
                      ? "bg-brand text-white ring-4 ring-brand/20"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {index < form.currentStep ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    index + 1
                  )}
                </div>
                <span
                  className={cn(
                    "mt-2 text-xs font-medium hidden sm:block",
                    index <= form.currentStep
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {step.title}
                </span>
              </div>
            ))}
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-brand transition-all duration-300"
              style={{ width: `${((form.currentStep + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-card border rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">
              {STEPS[form.currentStep].title}
            </h2>
            <p className="text-muted-foreground">
              {STEPS[form.currentStep].description}
            </p>
          </div>

          {renderStep()}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={form.prevStep}
              disabled={form.currentStep === 0}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Anterior
            </Button>

            <div className="flex gap-2">
              {form.currentStep < STEPS.length - 1 && (
                <Button variant="ghost" onClick={handleSaveDraft}>
                  Guardar borrador
                </Button>
              )}

              {form.currentStep < STEPS.length - 1 ? (
                <Button onClick={form.nextStep}>
                  Siguiente
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={form.isSubmitting}
                  className="bg-brand hover:bg-brand/90"
                >
                  {form.isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Publicando...
                    </>
                  ) : (
                    "Publicar anuncio"
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
