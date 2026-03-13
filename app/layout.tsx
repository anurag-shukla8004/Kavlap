import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from 'react-hot-toast';
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kavlap - Door to Door Car Wash",
  description: "Professional door-to-door car wash services. Book your car cleaning service online with Kavlap.",
  keywords: "car wash, door to door, car cleaning, auto detailing, Kavlap",
  authors: [{ name: "Kavlap" }],
  creator: "Kavlap",
  publisher: "Kavlap",
  icons: {
    icon: [
      { url: "/Frame 33.svg", type: "image/svg+xml" },
      { url: "/kavlap-logo.png", type: "image/png" }
    ],
    shortcut: "/Frame 33.svg",
    apple: "/kavlap-logo.png",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "Kavlap - Door to Door Car Wash",
    description: "Professional door-to-door car wash services. Book your car cleaning service online.",
    type: "website",
    siteName: "Kavlap",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kavlap - Door to Door Car Wash",
    description: "Professional door-to-door car wash services. Book your car cleaning service online.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster />
        {children}
      </body>
    </html>
  );
}
