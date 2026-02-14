import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Rentazuela — Marketplace Inmobiliario de Venezuela",
    template: "%s | Rentazuela",
  },
  description:
    "Marketplace unificado para Venezuela — propiedades, vehículos, locales comerciales e inversiones. Publica gratis tu anuncio.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  keywords: ["inmuebles", " Venezuela", "alquiler", "venta", "propiedades", "vehículos", "carros", "locales", "inversiones"],
  openGraph: {
    title: "Rentazuela — Marketplace Inmobiliario de Venezuela",
    description: "Marketplace unificado para Venezuela — propiedades, vehículos, locales comerciales e inversiones.",
    url: "https://rentazuela.com",
    siteName: "Rentazuela",
    locale: "es_VE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rentazuela — Marketplace Inmobiliario de Venezuela",
    description: "Marketplace unificado para Venezuela — propiedades, vehículos, locales comerciales e inversiones.",
  },
  icons: {
    icon: "/logo-icon.svg",
    shortcut: "/logo-icon.svg",
    apple: "/logo-icon.svg",
  },
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#E81C1C",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Toaster richColors position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
