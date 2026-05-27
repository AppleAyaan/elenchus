import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Playfair_Display } from "next/font/google";
import { Navbar } from "@/components/layout/navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Elenchus",
  description:
    "An AI VC that breaks your pitch to make it better. Stress-test your startup ideas through Socratic questioning.",
  icons: {
    icon: "/elenchus_transparent.png",
    apple: "/elenchus_transparent.png",
  },
  openGraph: {
    title: "Elenchus",
    description:
      "An AI VC that breaks your pitch to make it better.",
    type: "website",
    siteName: "Elenchus",
  },
  twitter: {
    card: "summary_large_image",
    title: "Elenchus",
    description:
      "An AI VC that breaks your pitch to make it better.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[#f5f5f0] font-sans">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
