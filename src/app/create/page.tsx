'use client';

import PostForm from '@/components/PostForm';
import Toast from '@/components/Toast';
import { createPost } from '@/lib/api';
import { CreatePostData } from '@/types';
import { useState } from 'react';

export default function CreatePostPage() {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<
    'info' | 'success' | 'warning' | 'error'
  >('info');

  const handleCreatePost = async (postData: CreatePostData) => {
    try {
      const newPost = await createPost(postData);

      if (!newPost) {
        throw new Error('게시글 저장에 실패했습니다.');
      }

      // 성공 메시지 표시
      setToastMessage('게시글이 성공적으로 저장되었습니다.');
      setToastType('success');
      setShowToast(true);

      // 리다이렉트는 PostForm 컴포넌트에서 처리
    } catch (error) {
      console.error('게시글 생성 오류:', error);
      setToastMessage('게시글을 저장하는 중 오류가 발생했습니다.');
      setToastType('error');
      setShowToast(true);
      throw error; // 에러를 다시 던져 PostForm에서 처리하게 함
    }
  };

  return (
    <div className="w-full max-w-full">
      <h1 className="text-2xl font-bold mb-6">새 게시글 작성</h1>
      <PostForm onSubmit={handleCreatePost} />

      {/* 토스트 메시지 */}
      <Toast
        message={toastMessage}
        type={toastType}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}
