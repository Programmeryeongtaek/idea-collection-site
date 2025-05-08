import SearchSelectedPageContent from '@/components/SearchSelectedPageContent';
import { Suspense } from 'react';

export default function SearchSelectedPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
          <p className="ml-3 text-gray-600">로딩 중...</p>
        </div>
      }
    >
      <SearchSelectedPageContent />
    </Suspense>
  );
}
