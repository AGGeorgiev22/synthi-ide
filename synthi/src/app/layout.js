import { Geist, Geist_Mono } from "next/font/google";
import { Roboto_Slab } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"
import { Analytics } from '@vercel/analytics/next';
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const robotoSlab = Roboto_Slab({
  variable: "--font-roboto-slab",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Synthi - World's first ADE.",
  description:
    "Synthi is the world's first Autonomous Development Environment. Cloud-compiled, AI-native, and built so you can focus on ideas — not infrastructure.",
  keywords: ["IDE", "cloud IDE", "ADE", "AI coding", "cloud compile", "developer tools", "Synthi"],
  authors: [{ name: "Synthi" }],
  metadataBase: new URL("https://synthi.app"),
  openGraph: {
    title: "Synthi - World's first ADE.",
    description:
      "Cloud-compiled, AI-native development. Build at instant — regardless of your hardware.",
    url: "https://synthi.app",
    siteName: "Synthi",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Synthi - World's first ADE.",
    description:
      "Cloud-compiled, AI-native development. Build at instant — regardless of your hardware.",
  },
  icons: {
    icon: "/synthi-logo.svg",
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${robotoSlab.variable} antialiased`}
      >
        <main>
          {children}
        </main>
        <Toaster richColors />
        <Analytics />
      </body>
    </html>
  );
}
