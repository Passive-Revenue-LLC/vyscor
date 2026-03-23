import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VYSCOR - Sports & Esports Hub",
  description: "Plataforma de eventos deportivos y e-sports con seguimiento en tiempo real. Resultados en vivo, estadísticas y más.",
  keywords: ["deportes", "esports", "eventos", "en vivo", "resultados", "CS2", "LoL", "fútbol"],
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="font-body antialiased">
        {children}
      </body>
    </html>
  );
}
