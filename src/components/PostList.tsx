'use client';

import { Post } from '@/types';
import { useEffect, useState } from 'react';

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    // 실제로는 API 호출을 통해 데이터 가져오기
    // 임시로 로컬 스토리지에서 가져오기
    const savedPosts = JSON.parse(localStorage.getItem('posts') || '[]');
    setPosts(savedPosts);
  }, []);

  if (posts.length === 0) {
    return (
      <p className="text-gray-500">
        게시글이 없습니다. 첫 게시글을 작성해보세요!
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">게시글 목록</h2>

      {posts.map((post) => (
        <div key={post.id} className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-medium">{post.title}</h3>
            <span className="px-2 py-1 bg-gray-100 rounded-full text-sm">
              {post.category}
            </span>
          </div>
          <p className="text-gray-700">{post.content}</p>
          <p className="text-gray-500 text-sm mt-2">
            {new Date(post.createdAt).toLocaleString('ko-KR')}
          </p>
        </div>
      ))}
    </div>
  );
}
