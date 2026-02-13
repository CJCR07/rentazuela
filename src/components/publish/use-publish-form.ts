"use client";

import { useState, useCallback } from "react";
import type { ListingCategory, PropertyDetails, VehicleDetails, CommercialDetails } from "@/types";
import type { Json } from "@/types/database";

/* ── Types ─────────────────────────────────────────────────── */

export type ListingType = "sale" | "rent" | "vacation";

export interface PublishFormData {
  // Step 1: Category
  category: ListingCategory | null;
  listingType: ListingType | null;
  
  // Step 2: Basic Info
  title: string;
  description: string;
  price: number;
  currency: "USD" | "VES";
  
  // Step 3: Location
  city: string;
  state: string;
  address: string;
  
  // Step 4: Details (category-specific)
  details: PropertyDetails | VehicleDetails | CommercialDetails | null;
  
  // Step 5: Images
  images: File[];
  existingImageIds: string[];
  
  // Metadata
  isDraft: boolean;
}

export interface UsePublishFormReturn {
  data: PublishFormData;
  currentStep: number;
  totalSteps: number;
  isSubmitting: boolean;
  errors: Record<string, string>;
  
  // Navigation
  nextStep: () => boolean;
  prevStep: () => void;
  goToStep: (step: number) => void;
  
  // Data updates
  updateData: (updates: Partial<PublishFormData>) => void;
  setDetails: (details: PublishFormData["details"]) => void;
  addImage: (file: File) => void;
  removeImage: (index: number) => void;
  reorderImages: (from: number, to: number) => void;
  
  // Validation
  validateStep: (step: number) => boolean;
  setErrors: (errors: Record<string, string>) => void;
  clearErrors: () => void;
  
  // Submission
  submit: () => Promise<{ success: boolean; listingId?: string; error?: string }>;
  
  // Reset
  reset: () => void;
}

/* ── Initial State ─────────────────────────────────────────── */

const initialData: PublishFormData = {
  category: null,
  listingType: null,
  title: "",
  description: "",
  price: 0,
  currency: "USD",
  city: "",
  state: "",
  address: "",
  details: null,
  images: [],
  existingImageIds: [],
  isDraft: false,
};

/* ── Hook ───────────────────────────────────────────────────── */

export function usePublishForm(): UsePublishFormReturn {
  const [data, setData] = useState<PublishFormData>(initialData);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const totalSteps = 6;

  const updateData = useCallback((updates: Partial<PublishFormData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  }, []);

  const setDetails = useCallback((details: PublishFormData["details"]) => {
    setData((prev) => ({ ...prev, details }));
  }, []);

  const addImage = useCallback((file: File) => {
    setData((prev) => ({
      ...prev,
      images: [...prev.images, file],
    }));
  }, []);

  const removeImage = useCallback((index: number) => {
    setData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  }, []);

  const reorderImages = useCallback((from: number, to: number) => {
    setData((prev) => {
      const newImages = [...prev.images];
      const [removed] = newImages.splice(from, 1);
      newImages.splice(to, 0, removed);
      return { ...prev, images: newImages };
    });
  }, []);

  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  const validateStep = useCallback((step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 0: // Category
        if (!data.category) newErrors.category = "Selecciona una categoría";
        if (!data.listingType) newErrors.listingType = "Selecciona el tipo de anuncio";
        break;

      case 1: // Basic Info
        if (!data.title.trim()) newErrors.title = "El título es requerido";
        else if (data.title.length < 10) newErrors.title = "El título debe tener al menos 10 caracteres";
        if (!data.description.trim()) newErrors.description = "La descripción es requerida";
        else if (data.description.length < 30) newErrors.description = "La descripción debe tener al menos 30 caracteres";
        if (!data.price || data.price <= 0) newErrors.price = "Ingresa un precio válido";
        break;

      case 2: // Location
        if (!data.city.trim()) newErrors.city = "La ciudad es requerida";
        if (!data.state.trim()) newErrors.state = "El estado es requerido";
        break;

      case 3: // Details
        // Category-specific validation
        if (data.category === "property_longterm" || data.category === "property_shortterm") {
          const details = data.details as PropertyDetails;
          if (!details?.property_type) newErrors.property_type = "Selecciona el tipo de propiedad";
        }
        if (data.category === "vehicle") {
          const details = data.details as VehicleDetails;
          if (!details?.vehicle_type) newErrors.vehicle_type = "Selecciona el tipo de vehículo";
        }
        if (data.category === "commercial") {
          const details = data.details as CommercialDetails;
          if (!details?.commercial_type) newErrors.commercial_type = "Selecciona el tipo de local";
        }
        break;

      case 4: // Images
        if (data.images.length === 0) {
          newErrors.images = "Agrega al menos una imagen";
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [data]);

  const nextStep = useCallback((): boolean => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps - 1));
      return true;
    }
    return false;
  }, [currentStep, validateStep]);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  const goToStep = useCallback((step: number) => {
    setCurrentStep(Math.max(0, Math.min(step, totalSteps - 1)));
  }, []);

  const submit = useCallback(async (): Promise<{ success: boolean; listingId?: string; error?: string }> => {
    if (!validateStep(currentStep)) {
      return { success: false, error: "Por favor completa todos los campos requeridos" };
    }

    setIsSubmitting(true);

    try {
      const { createListing } = await import("@/lib/actions/listings");
      const { uploadListingImage } = await import("@/lib/actions/images");

      // Create listing
      const result = await createListing({
        title: data.title,
        description: data.description,
        category: data.category!,
        price: data.price,
        currency: data.currency,
        city: data.city,
        state: data.state,
        address: data.address || undefined,
        details: (data.details || undefined) as Json,
      });

      if (!result.success || !result.listing) {
        return { success: false, error: result.error || "Error al crear el anuncio" };
      }

      // Upload images
      for (const file of data.images) {
        await uploadListingImage(file, result.listing.id);
      }

      return { success: true, listingId: result.listing.id };
    } catch (error) {
      console.error("Error submitting listing:", error);
      return { success: false, error: "Error al publicar el anuncio" };
    } finally {
      setIsSubmitting(false);
    }
  }, [data, currentStep, validateStep]);

  const reset = useCallback(() => {
    setData(initialData);
    setCurrentStep(0);
    setErrors({});
    setIsSubmitting(false);
  }, []);

  return {
    data,
    currentStep,
    totalSteps,
    isSubmitting,
    errors,
    nextStep,
    prevStep,
    goToStep,
    updateData,
    setDetails,
    addImage,
    removeImage,
    reorderImages,
    validateStep,
    setErrors,
    clearErrors,
    submit,
    reset,
  };
}
