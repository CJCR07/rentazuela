import { Suspense } from "react";
import { PropiedadesClient } from "./client";
import { getListingsWithImages } from "@/lib/actions/listings";

export default async function PropiedadesPage() {
  const initialData = await getListingsWithImages({
    category: "property_longterm",
    limit: 12,
  });

  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <PropiedadesClient initialData={initialData} />
    </Suspense>
  );
}
