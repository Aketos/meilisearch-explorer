import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

// Use Inter with better readability settings
const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "Meilisearch Explorer",
  description: "A web application to explore and manage Meilisearch content",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#f8fafc" />
      </head>
      <body className={`${inter.className} antialiased`}>
        <Navbar />
        <main className="container mx-auto px-4 sm:px-6 py-8 max-w-7xl">
          {children}
        </main>
        <footer className="border-t border-gray-200 mt-12">
          <div className="container mx-auto px-4 sm:px-6 py-6 text-center text-gray-600 text-sm">
            <p>Meilisearch Explorer © {new Date().getFullYear()}</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
