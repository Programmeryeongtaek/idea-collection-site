import PostList from '@/components/PostList';
import { PostCategory } from '@/types';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// 유효한 카테고리 경로
const validCategories = {
  idea: PostCategory.IDEA,
  sentence: PostCategory.SENTENCE,
  quote: PostCategory.QUOTE,
  video: PostCategory.VIDEO,
  other: PostCategory.OTHER,
};

type CategoryPageProps = {
  params: {
    type: string;
  };
};

export default function CategoryPage({ params }: CategoryPageProps) {
  // 카테고리 타입 확인 및 변환
  const categoryType = params.type;

  if (!Object.keys(validCategories).includes(categoryType)) {
    return notFound();
  }

  const category =
    validCategories[categoryType as keyof typeof validCategories];

  return (
    <div className="w-full max-w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{category} 모음</h1>
        <Link
          href="/create"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          새 게시글 작성
        </Link>
      </div>

      <PostList category={category} />
    </div>
  );
}
