'use client';

import { PostCategory } from '@/types';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  // 카테고리별 경로 설정
  const navItems = [
    { name: '전체보기', path: '/' },
    { name: PostCategory.IDEA, path: '/category/idea' },
    { name: PostCategory.SENTENCE, path: '/category/sentence' },
    { name: PostCategory.QUOTE, path: '/category/quote' },
    { name: PostCategory.VIDEO, path: '/category/video' },
    { name: PostCategory.OTHER, path: '/category/other' },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0 overflow-y-auto">
      <div className="p-6">
        <h2 className="text-xl font-bold mb-8">카테고리</h2>
        <nav>
          <ul className="space-y-3">
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
