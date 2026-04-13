import type { Metadata } from "next";
// @ts-ignore
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import AppNavbar from "@/components/AppNavbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "hanzi.io.vn - Nền tảng học Tiếng Trung HSK 3.0 Toàn diện",
  description: "Học tiếng Trung từ cơ bản đến nâng cao chuẩn HSK 1-6. Hệ thống Flashcard SRS, luyện nghe AI, và kho đề thi THPT miễn phí.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Lấy dữ liệu xác thực ở phía Server - cực kỳ ổn định
  const { userId } = await auth();
  const isSignedIn = !!userId;

  return (
    <ClerkProvider>
      <html lang="vi">
        <body>
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
