import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "VYSCOR — Real-Time Sports Scores",
  description: "Vyscor es la plataforma de scores deportivos en tiempo real. Velocidad, claridad y la información esencial de cada partido sin ruido.",
  keywords: ["vyscor", "scores", "deportes", "esports", "en vivo", "resultados", "CS2", "LoL", "fútbol"],
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/assets/brandmark-white.svg", type: "image/svg+xml" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-DTHWELXGD1"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-DTHWELXGD1');
          `}
        </Script>
      </head>
      <body className="font-syncopate antialiased">
        {children}
      </body>
    </html>
  );
}
