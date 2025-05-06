'use client';

import { getAllPosts, getPostsByCategory } from '@/lib/api';
import { Post, PostCategory } from '@/types';
import { useEffect, useState } from 'react';

interface PostListProps {
  category: PostCategory | null; // null은 모든 카테고리
}

export default function PostList({ category }: PostListProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPosts() {
      setLoading(true);
      try {
        let fetchedPosts;
        if (category) {
          fetchedPosts = await getPostsByCategory(category);
        } else {
          fetchedPosts = await getAllPosts();
        }
        setPosts(fetchedPosts);
      } catch (error) {
        console.error('게시글을 불러오는 중 오류 발생:', error);
        setError('게시글을 불러오는데 실패헀습니다. 다시 시도해주세요.');
      } finally {
        setLoading(false);
      }
    }

    loadPosts();
  }, [category]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center w-full">
        <p className="text-gray-500">게시글을 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center w-full">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center w-full">
        <p className="text-gray-500">게시글이 없습니다.</p>
        <p className="text-gray-500">첫 게시글을 작성해보세요!</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-white rounded-lg shadow p-6 w-full border border-gray-100"
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xl font-medium">{post.title}</h3>
            <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
              {post.category}
            </span>
          </div>
          <p className="text-gray-700 mb-4">{post.content}</p>

          {/* 키워드 표시 */}
          {post.keywords && post.keywords.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-3 mb-2">
              {post.keywords.map((keyword, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600"
                >
                  #{keyword}
                </span>
              ))}
            </div>
          )}

          <p className="text-gray-500 text-sm mt-2">
            {new Date(post.created_at).toLocaleString('ko-KR')}
          </p>
        </div>
      ))}
    </div>
  );
}
