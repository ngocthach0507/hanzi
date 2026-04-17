import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import AppNavbar from "@/components/AppNavbar";
import Footer from "@/components/Footer";

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
        <body className="antialiased font-sans" suppressHydrationWarning>
          <AppNavbar />

          <main className="min-h-screen">
            {children}
          </main>

          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
