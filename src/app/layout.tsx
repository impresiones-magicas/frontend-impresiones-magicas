
import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/AuthContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Impresiones mágicas",
  description: "Impresiones mágicas"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} antialiased overflow-x-hidden`}
      >
        <AuthProvider>
          {children}
          <Toaster
            toastOptions={{
              classNames: {
                error: 'group-[.toaster]:!bg-white group-[.toaster]:!text-red-600 group-[.toaster]:!border-red-200 group-[.toaster]:!border-2 !shadow-lg',
                success: 'group-[.toaster]:!bg-white group-[.toaster]:!text-green-600 group-[.toaster]:!border-green-200 group-[.toaster]:!border-2 !shadow-lg',
                warning: 'group-[.toaster]:!bg-white group-[.toaster]:!text-yellow-600 group-[.toaster]:!border-yellow-200 group-[.toaster]:!border-2 !shadow-lg',
                info: 'group-[.toaster]:!bg-white group-[.toaster]:!text-blue-600 group-[.toaster]:!border-blue-200 group-[.toaster]:!border-2 !shadow-lg',
                description: '!text-black !text-opacity-100',
              },
            }}
          />
        </AuthProvider>
      </body>
    </html>
  );
}
