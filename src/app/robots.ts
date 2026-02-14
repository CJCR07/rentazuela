import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://rentazuela.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/auth/", "/dashboard/", "/admin/", "/publicar/", "/mis-anuncios/", "/mensajes/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
