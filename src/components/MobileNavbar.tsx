'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PostCategory } from '@/types';

export default function MobileNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // 카테고리별 경로 설정
  const navItems = [
    { name: '전체보기', path: '/' },
    { name: PostCategory.IDEA, path: '/category/idea' },
    { name: PostCategory.SENTENCE, path: '/category/sentence' },
    { name: PostCategory.QUOTE, path: '/category/quote' },
    { name: PostCategory.VIDEO, path: '/category/video' },
  ];

  // 스크롤 잠금 처리
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  return (
    <>
      {/* 모바일 헤더 */}
      <div className="sticky top-0 z-30 bg-white shadow-sm">
        <div className="flex items-center justify-between p-4">
          <Link href="/" className="text-xl font-bold">
            아이디어 모음
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-md hover:bg-gray-100"
            aria-label={isOpen ? '메뉴 닫기' : '메뉴 열기'}
          >
            {isOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* 모바일 메뉴 */}
      {isOpen && (
        <div className="fixed inset-0 z-20 bg-white pt-16">
          <nav className="p-4">
            <ul className="space-y-4">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    href={item.path}
                    className={`block px-4 py-3 rounded-md text-lg ${
                      pathname === item.path
                        ? 'bg-indigo-100 text-indigo-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}

              {/* 새 게시글 작성 버튼 */}
              <li className="mt-8">
                <Link
                  href="/create"
                  className="block w-full py-3 px-4 bg-indigo-600 text-white text-center rounded-md font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  새 게시글 작성
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </>
  );
}
