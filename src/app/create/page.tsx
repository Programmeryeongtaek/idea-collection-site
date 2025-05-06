'use client';

import PostForm from '@/components/PostForm';
import Toast from '@/components/Toast';
import { createPost } from '@/lib/api';
import { CreatePostData } from '@/types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CreatePostPage() {
  const router = useRouter();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<
    'info' | 'success' | 'warning' | 'error'
  >('info');
  const [loading, setLoading] = useState(false);

  const handleCreatePost = async (postData: CreatePostData) => {
    setLoading(true);

    try {
      // 리디렉션 정보를 함께 받는 새로운 API 호출
      const result = await createPost(postData);

      if (!result.post) {
        throw new Error('게시글 저장에 실패했습니다.');
      }

      // 성공 메시지 표시
      setToastMessage('게시글이 성공적으로 저장되었습니다.');
      setToastType('success');
      setShowToast(true);

      // 토스트 메시지 표시 후 리디렉션 추가
      setTimeout(() => {
        router.push(result.redirectUrl);
      }, 1000); // 1초 후 리디렉션
    } catch (error) {
      console.error('게시글 생성 오류:', error);
      setToastMessage('게시글을 저장하는 중 오류가 발생했습니다.');
      setToastType('error');
      setShowToast(true);
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-full">
      <h1 className="text-2xl font-bold mb-6">새 게시글 작성</h1>
      <PostForm onSubmit={handleCreatePost} initialLoading={loading} />

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
