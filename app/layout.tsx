import type { Metadata } from "next";
import { Geist, Geist_Mono, Parkinsans } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const parkinsans = Parkinsans({
  variable: "--font-parkinsans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Shop - Launch Your AI-Powered Store in Minutes",
  description:
    "Transform your e-commerce vision into reality with AI Shop. Create professional online stores in under 15 minutes using cutting-edge AI technology. Start your intelligent e-commerce journey today.",
  keywords: "AI e-commerce, online store builder, artificial intelligence, e-commerce platform, store creation, AI-powered shopping",
  authors: [{ name: "AI Shop Team" }],
  creator: "AI Shop",
  publisher: "AI Shop",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ai-shop.com",
    title: "AI Shop - Launch Your AI-Powered Store in Minutes",
    description: "Transform your e-commerce vision into reality with AI Shop. Create professional online stores in under 15 minutes using cutting-edge AI technology.",
    siteName: "AI Shop",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Shop - Launch Your AI-Powered Store in Minutes",
    description: "Transform your e-commerce vision into reality with AI Shop. Create professional online stores in under 15 minutes using cutting-edge AI technology.",
    creator: "@aishop",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${parkinsans.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
