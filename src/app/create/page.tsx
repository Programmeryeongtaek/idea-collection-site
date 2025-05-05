'use client';

import PostForm from '@/components/PostForm';
import { Post } from '@/types';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';

export default function CreatePostPage() {
  const router = useRouter();

  const handleCreatePost = async (postData: Omit<Post, 'id' | 'createdAt'>) => {
    try {
      const newPost: Post = {
        ...postData,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
      };

      // 실제로는 API 호출을 통해 저장
      // 임시로 로컬 스토리지에 저장
      const existingPosts = JSON.parse(localStorage.getItem('posts') || '[]');
      localStorage.setItem(
        'posts',
        JSON.stringify([newPost, ...existingPosts])
      );

      router.push('/');
    } catch (error) {
      console.error('게시글 생성 오류:', error);
      alert('게시글을 저장하는 중 오류가 발생했습니다.');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">새 게시글 작성</h1>
      <PostForm onSubmit={handleCreatePost} />
    </div>
  );
}
