'use client';

import PostForm from '@/components/PostForm';
import { CreatePostData, Post } from '@/types';
import { v4 as uuidv4 } from 'uuid';

export default function CreatePostPage() {
  const handleCreatePost = async (postData: CreatePostData) => {
    try {
      const newPost: Post = {
        ...postData,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
      };

      // 로컬 스토리지에 저장
      const existingPosts = JSON.parse(localStorage.getItem('posts') || '[]');
      localStorage.setItem(
        'posts',
        JSON.stringify([newPost, ...existingPosts])
      );

      // 리다이렉트는 PostForm 컴포넌트에서 처리
    } catch (error) {
      console.error('게시글 생성 오류:', error);
      alert('게시글을 저장하는 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="w-full max-w-full">
      <h1 className="text-2xl font-bold mb-6">새 게시글 작성</h1>
      <PostForm onSubmit={handleCreatePost} />
    </div>
  );
}
