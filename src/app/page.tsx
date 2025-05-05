import PostList from '@/components/PostList';
import Link from 'next/link';

export default function Hom() {
  return (
    <main>
      <h1 className="text-3xl font-bold mb-6">아이디어 모음 사이트</h1>

      <div className="mb-6">
        <Link
          href="/create"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          새 게시글 작성
        </Link>
      </div>

      <PostList />
    </main>
  );
}
