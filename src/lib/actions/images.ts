"use server";

import { createClient } from "@/lib/supabase/server";
import type { ListingImage } from "@/types";

/* ── Types ─────────────────────────────────────────────────── */

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

export interface ImageUploadResult {
  success: boolean;
  image?: ListingImage;
  error?: string;
}

/* ── Constants ──────────────────────────────────────────────── */

const BUCKET_NAME = "listing-images";
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

/* ── Upload Image ───────────────────────────────────────────── */

export async function uploadListingImage(
  file: File,
  listingId: string
): Promise<ImageUploadResult> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { success: false, error: "Debes iniciar sesión" };
  }

  // Validate file
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { 
      success: false, 
      error: "Tipo de archivo no permitido. Usa JPEG, PNG o WebP" 
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { 
      success: false, 
      error: "El archivo es muy grande. Máximo 5MB" 
    };
  }

  // Generate unique filename
  const ext = file.name.split(".").pop() || "jpg";
  const fileName = `${listingId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  // Upload to storage
  const { error: uploadError } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) {
    console.error("Error uploading image:", uploadError);
    return { success: false, error: "Error al subir la imagen" };
  }

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(fileName);

  // Get current max position
  const { data: existingImages } = await supabase
    .from("listing_images")
    .select("position")
    .eq("listing_id", listingId)
    .order("position", { ascending: false })
    .limit(1);

  const nextPosition = (existingImages?.[0]?.position ?? -1) + 1;

  // Save to database
  const { data: imageRecord, error: dbError } = await supabase
    .from("listing_images")
    .insert({
      listing_id: listingId,
      url: publicUrl,
      position: nextPosition,
    })
    .select()
    .single();

  if (dbError) {
    console.error("Error saving image record:", dbError);
    // Try to delete from storage
    await supabase.storage.from(BUCKET_NAME).remove([fileName]);
    return { success: false, error: "Error al guardar la imagen" };
  }

  return { success: true, image: imageRecord as ListingImage };
}

/* ── Delete Image ──────────────────────────────────────────── */

export async function deleteListingImage(
  imageId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { success: false, error: "Debes iniciar sesión" };
  }

  // Get image info and verify ownership
  const { data: image } = await supabase
    .from("listing_images")
    .select("id, url, listing_id, listings!inner(owner_id)")
    .eq("id", imageId)
    .single();

  if (!image) {
    return { success: false, error: "Imagen no encontrada" };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((image.listings as any).owner_id !== user.id) {
    return { success: false, error: "No tienes permiso para eliminar esta imagen" };
  }

  // Delete from storage
  const urlParts = image.url.split("/");
  const fileName = urlParts.slice(-2).join("/"); // listingId/filename.ext
  
  await supabase.storage.from(BUCKET_NAME).remove([fileName]);

  // Delete from database
  const { error } = await supabase
    .from("listing_images")
    .delete()
    .eq("id", imageId);

  if (error) {
    console.error("Error deleting image:", error);
    return { success: false, error: "Error al eliminar la imagen" };
  }

  return { success: true };
}

/* ── Update Image Order ────────────────────────────────────── */

export async function updateImageOrder(
  imageIds: string[]
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { success: false, error: "Debes iniciar sesión" };
  }

  // Update each image position
  for (let i = 0; i < imageIds.length; i++) {
    await supabase
      .from("listing_images")
      .update({ position: i })
      .eq("id", imageIds[i]);
  }

  return { success: true };
}

/* ── Get Images for Listing ─────────────────────────────────── */

export async function getListingImages(
  listingId: string
): Promise<ListingImage[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("listing_images")
    .select("*")
    .eq("listing_id", listingId)
    .order("position", { ascending: true });

  if (error) {
    console.error("Error fetching images:", error);
    return [];
  }

  return data as ListingImage[];
}

/* ── Check Storage Bucket Exists ────────────────────────────── */

export async function ensureStorageBucket(): Promise<boolean> {
  const supabase = await createClient();

  const { data: buckets } = await supabase.storage.listBuckets();
  
  const bucketExists = buckets?.some((b) => b.name === BUCKET_NAME);
  
  if (!bucketExists) {
    const { error } = await supabase.storage.createBucket(BUCKET_NAME, {
      public: true,
      fileSizeLimit: MAX_FILE_SIZE,
      allowedMimeTypes: ALLOWED_TYPES,
    });
    
    if (error) {
      console.error("Error creating bucket:", error);
      return false;
    }
  }

  return true;
}
