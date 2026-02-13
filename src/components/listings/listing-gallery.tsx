"use client";

import { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ListingImage } from "@/types";

/* ── Types ─────────────────────────────────────────────────── */

interface ListingGalleryProps {
  images: ListingImage[];
  title: string;
}

/* ── Gallery Grid (Preview) ────────────────────────────────── */

export function ListingGallery({ images, title }: ListingGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = "";
  };

  if (images.length === 0) {
    return (
      <div className="aspect-[16/9] bg-muted rounded-2xl flex items-center justify-center">
        <p className="text-muted-foreground">Sin imágenes disponibles</p>
      </div>
    );
  }

  const displayImages = images.slice(0, 5);
  const remainingCount = images.length - 5;

  return (
    <>
      {/* Grid Layout - Airbnb Style */}
      <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[400px] md:h-[480px] rounded-2xl overflow-hidden">
        {/* Main Image (left side, spans 2 rows) */}
        <div
          className="col-span-2 row-span-2 relative cursor-pointer group"
          onClick={() => openLightbox(0)}
        >
          <img
            src={displayImages[0]?.url}
            alt={`${title} - Imagen 1`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        </div>

        {/* Right side images (4 smaller images) */}
        {displayImages.slice(1, 5).map((image, index) => (
          <div
            key={image.id}
            className="relative cursor-pointer group"
            onClick={() => openLightbox(index + 1)}
          >
            <img
              src={image.url}
              alt={`${title} - Imagen ${index + 2}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            
            {/* "Ver todas" overlay on last image */}
            {index === 3 && remainingCount > 0 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  +{remainingCount} más
                </span>
              </div>
            )}
          </div>
        ))}

        {/* "Ver todas las fotos" button */}
        <button
          onClick={() => openLightbox(0)}
          className="absolute bottom-4 right-4 bg-white dark:bg-card px-4 py-2 rounded-lg font-semibold text-sm shadow-lg hover:scale-105 transition-transform"
        >
          Ver todas las fotos ({images.length})
        </button>
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <Lightbox
          images={images}
          currentIndex={currentIndex}
          onClose={closeLightbox}
          onNavigate={setCurrentIndex}
          title={title}
        />
      )}
    </>
  );
}

/* ── Lightbox Component ────────────────────────────────────── */

interface LightboxProps {
  images: ListingImage[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
  title: string;
}

function Lightbox({ images, currentIndex, onClose, onNavigate, title }: LightboxProps) {
  const handlePrev = useCallback(() => {
    onNavigate(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
  }, [currentIndex, images.length, onNavigate]);

  const handleNext = useCallback(() => {
    onNavigate(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
  }, [currentIndex, images.length, onNavigate]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handlePrev, handleNext, onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-black/95 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 text-white">
        <div>
          <span className="font-semibold">
            {currentIndex + 1} / {images.length}
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Main Image */}
      <div className="flex-1 relative flex items-center justify-center px-4">
        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
            >
              <ChevronLeft className="h-6 w-6 text-white" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10"
            >
              <ChevronRight className="h-6 w-6 text-white" />
            </button>
          </>
        )}

        {/* Image */}
        <img
          src={images[currentIndex]?.url}
          alt={`${title} - Imagen ${currentIndex + 1}`}
          className="max-h-[70vh] max-w-full object-contain"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="p-4 overflow-x-auto">
          <div className="flex gap-2 justify-center">
            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => onNavigate(index)}
                className={cn(
                  "shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all",
                  index === currentIndex
                    ? "ring-2 ring-white ring-offset-2 ring-offset-black"
                    : "opacity-50 hover:opacity-100"
                )}
              >
                <img
                  src={image.url}
                  alt={`${title} - Miniatura ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
