
import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
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

import { ThemeProvider } from "@/components/ThemeProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} antialiased overflow-x-hidden`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AuthProvider>
            <CartProvider>
              {children}
              <Toaster
                theme="light"
                richColors
                position="bottom-right"
                toastOptions={{
                  classNames: {
                    error: 'group-[.toaster]:!text-red-600 group-[.toaster]:!border-red-200 group-[.toaster]:!border-2 !shadow-lg dark:group-[.toaster]:!border-red-900/50',
                    success: 'group-[.toaster]:!text-emerald-600 group-[.toaster]:!border-emerald-200 group-[.toaster]:!border-2 !shadow-lg dark:group-[.toaster]:!border-emerald-900/50',
                    warning: 'group-[.toaster]:!text-amber-600 group-[.toaster]:!border-amber-200 group-[.toaster]:!border-2 !shadow-lg dark:group-[.toaster]:!border-amber-900/50',
                    info: 'group-[.toaster]:!text-blue-600 group-[.toaster]:!border-blue-200 group-[.toaster]:!border-2 !shadow-lg dark:group-[.toaster]:!border-blue-900/50',
                    description: 'group-[.toaster]:!text-gray-600',
                  },
                }}
              />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
