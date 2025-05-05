import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

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
    <html lang="ko">
      <body className={inter.className}>
        <div className="container mx-auto p-4">{children}</div>
      </body>
    </html>
  );
}
