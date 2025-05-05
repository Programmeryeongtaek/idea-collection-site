'use client';

import { PostCategory } from '@/types';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

export default function Sidebar() {
  const [searchTerm, setSearchTerm] = useState('');
  const pathname = usePathname();
  const router = useRouter();

  // 카테고리별 경로 설정
  const navItems = [
    { name: '전체보기', path: '/' },
    { name: PostCategory.IDEA, path: '/category/idea' },
    { name: PostCategory.SENTENCE, path: '/category/sentence' },
    { name: PostCategory.QUOTE, path: '/category/quote' },
    { name: PostCategory.VIDEO, path: '/category/video' },
    { name: PostCategory.OTHER, path: '/category/other' },
  ];

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    // 검색 결과 페이지로 이동
    router.push(`/search?term=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0 overflow-y-auto">
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">카테고리</h2>

        {/* 검색 폼 */}
        <div className="mb-6">
          <form onSubmit={handleSearch} className="space-y-2">
            <div className="flex">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="검색어를 입력하세요 (쉼표로 구분)"
                className="w-full rounded-l-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
              </button>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              여러 키워드는 쉼표(,)로 구분
            </div>
          </form>
        </div>

        <nav>
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`block px-4 py-2 rounded-md transition-colors duration-200 ${
                    pathname === item.path
                      ? 'bg-indigo-100 text-indigo-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
