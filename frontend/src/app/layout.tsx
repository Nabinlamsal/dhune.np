import type { Metadata } from "next";
import { Geist, Geist_Mono, Nunito } from "next/font/google";
import "./globals.css";;
import "leaflet/dist/leaflet.css";
import { Providers } from "./providers";
import { Toaster } from "sonner"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "Dhune",
  description: "Smart laundry platform for vendors and customers in Nepal",
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
    <html lang="en">
      <body className={`${nunito.variable} ${geistSans.variable} ${geistMono.variable} font-sans antialiased`
      }>
        <Providers>
          <Toaster position="top-right" richColors />
          {children}
        </Providers>
      </body >
    </html >
  );
}
