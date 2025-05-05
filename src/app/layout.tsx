import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import MobileNavbar from '@/components/MobileNavbar';
import Sidebar from '@/components/Sidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: '아이디어/문장/영상 모음 사이트',
  description: '아이디어, 문장, 영상 등을 수집하는 사이트',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      <body className={`${inter.className} h-full`}>
        <div className="min-h-screen h-full">
          {/* 모바일 네비게이션 */}
          <div className="md:hidden">
            <MobileNavbar />
          </div>

          {/* 데스크톱 레이아웃 */}
          <div className="flex h-full">
            {/* 데스크톱용 사이드바 - 모바일에서는 숨김 */}
            <div className="hidden md:block w-1 flex-shrink-0">
              <Sidebar />
            </div>

            {/* 메인 콘텐츠 */}
            <main className="flex-1 p-4 md:p-6 md:ml-64">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
