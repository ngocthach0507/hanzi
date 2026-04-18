import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import Script from "next/script";
import "./globals.css";
import AppNavbar from "@/components/AppNavbar";
import Footer from "@/components/Footer";
import WelcomeModal from "@/components/WelcomeModal";

export const metadata: Metadata = {
  title: "hanzi.io.vn - Nền tảng học Tiếng Trung HSK 3.0 Toàn diện",
  description: "Học tiếng Trung từ cơ bản đến nâng cao chuẩn HSK 1-6. Hệ thống Flashcard SRS, luyện nghe AI, và kho đề thi THPT miễn phí.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="vi" suppressHydrationWarning>
        <head>
          <Script src="https://cdn.jsdelivr.net/npm/hanzi-writer@3.5/dist/hanzi-writer.min.js" strategy="beforeInteractive" />
          {/* Google Analytics */}
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-RFGKV7WHTS"
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-RFGKV7WHTS');
            `}
          </Script>
          {/* Structured Data: Organization & WebSite */}
          <Script id="structured-data" type="application/ld+json" strategy="afterInteractive">
            {`
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": "Hanzi.io.vn",
                "url": "https://hanzi.io.vn",
                "logo": "https://hanzi.io.vn/logo.png",
                "sameAs": [
                  "https://www.facebook.com/tiengtrunghongdou"
                ],
                "description": "Nền tảng học tiếng Trung HSK 3.0 chuyên biệt cho người Việt."
              }
            `}
          </Script>
        </head>
        <body className="antialiased font-sans" suppressHydrationWarning>
          <AppNavbar />
          <WelcomeModal />

          <main className="min-h-screen">
            {children}
          </main>

          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
