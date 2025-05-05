import PostList from '@/components/PostList';
import Link from 'next/link';

export default function Hom() {
  return (
    <div className="w-full max-w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">아이디어 모음</h1>
        <Link
          href="/create"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          새 게시글 작성
        </Link>
      </div>

      <PostList category={null} />
    </div>
  );
}
