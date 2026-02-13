"use client";

import { useCallback, useState } from "react";
import { Upload, X, ImageIcon, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { UsePublishFormReturn } from "../use-publish-form";

/* ── Props ──────────────────────────────────────────────────── */

interface ImagesStepProps {
  form: UsePublishFormReturn;
}

/* ── Component ──────────────────────────────────────────────── */

export function ImagesStep({ form }: ImagesStepProps) {
  const { data, addImage, removeImage, errors } = form;
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      const validFiles = files.filter(
        (file) => file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024
      );

      validFiles.forEach((file) => addImage(file));
    },
    [addImage]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(
      (file) => file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024
    );

    validFiles.forEach((file) => addImage(file));
    e.target.value = "";
  };

  const maxImages = 10;
  const canAddMore = data.images.length < maxImages;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Fotos del Anuncio</h3>
        <span className="text-sm text-muted-foreground">
          {data.images.length}/{maxImages} imágenes
        </span>
      </div>

      {/* Upload Area */}
      {canAddMore && (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            "border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer",
            isDragging
              ? "border-brand bg-brand/5"
              : "border-border hover:border-muted-foreground/50"
          )}
        >
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            id="image-upload"
          />
          <label htmlFor="image-upload" className="cursor-pointer">
            <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
            <p className="font-medium mb-1">
              Arrastra las fotos aquí o haz clic para subir
            </p>
            <p className="text-sm text-muted-foreground">
              PNG, JPG o WebP hasta 5MB cada una
            </p>
          </label>
        </div>
      )}

      {errors.images && (
        <p className="text-sm text-destructive">{errors.images}</p>
      )}

      {/* Image Grid */}
      {data.images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {data.images.map((file, index) => (
            <div
              key={index}
              className="relative group aspect-square rounded-xl overflow-hidden bg-muted"
            >
              <img
                src={URL.createObjectURL(file)}
                alt={`Imagen ${index + 1}`}
                className="w-full h-full object-cover"
              />

              {/* Main badge */}
              {index === 0 && (
                <div className="absolute top-2 left-2 bg-brand text-white text-xs font-bold px-2 py-1 rounded">
                  Principal
                </div>
              )}

              {/* Remove button */}
              <button
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 p-1 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4 text-white" />
              </button>

              {/* Order indicator */}
              <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                <GripVertical className="h-3 w-3" />
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tips */}
      <div className="bg-muted/50 rounded-xl p-4">
        <h4 className="font-semibold text-sm mb-2">📸 Consejos para buenas fotos</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• La primera imagen será la principal del anuncio</li>
          <li>• Usa buena iluminación natural</li>
          <li>• Muestra los espacios amplios y detalles importantes</li>
          <li>• Incluye fotos del exterior e interior</li>
        </ul>
      </div>

      {data.images.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <ImageIcon className="h-16 w-16 text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground">
            Aún no has agregado imágenes
          </p>
        </div>
      )}
    </div>
  );
}
