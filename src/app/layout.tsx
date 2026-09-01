import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portalize | Zero-login client portals for freelancers",
  description:
    "Share project deliverables with clients through a private, zero-login portal. Preview, feedback, approvals, and payment-gated downloads.",
  keywords: [
    "client portal for freelancers",
    "freelance client portal",
    "deliverable preview",
    "watermarked file preview",
    "payment gated downloads",
    "freelance escrow delivery",
    "client approval portal",
    "zero login client portal",
  ],
  metadataBase: new URL("https://portalize.site"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Portalize — Stop sending Google Drive links like an amateur.",
    description:
      "Private client portals for freelancers. 1 link + 4-digit PIN. Watermarked previews. Downloads lock until the invoice is paid.",
    url: "https://portalize.site",
    siteName: "Portalize",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Portalize — Private client portals for freelancers",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Portalize — Stop sending Google Drive links like an amateur.",
    description:
      "1 link + 4-digit PIN. Watermarked previews. Downloads lock until the invoice is paid.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: [{ url: "/icon.png", type: "image/png" }],
    shortcut: ["/icon.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
