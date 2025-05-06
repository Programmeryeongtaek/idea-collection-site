'use client';

import PostForm from '@/components/PostForm';
import Toast from '@/components/Toast';
import { getPostById, updatePost } from '@/lib/api';
import { CreatePostData, Post } from '@/types';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function EditPostPage() {
  const params = useParams();
  const router = useRouter();
  const postId = params.id as string;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<
    'info' | 'success' | 'warning' | 'error'
  >('info');

  useEffect(() => {
    async function loadPost() {
      setLoading(true);
      try {
        const postData = await getPostById(postId);
        if (!postData) {
          setError('게시글을 찾을 수 없습니다.');
          return;
        }
        setPost(postData);
      } catch (error) {
        console.error('게시글 불러오기 오류:', error);
        setError('게시글을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    }

    loadPost();
  }, [postId]);

  const handleUpdatePost = async (postData: CreatePostData) => {
    setLoading(true);
    try {
      const updatedPost = await updatePost(postId, postData);

      if (!updatedPost) {
        throw new Error('게시글 수정에 실패했습니다.');
      }

      setToastMessage('게시글이 성공적으로 수정되었습니다.');
      setToastType('success');
      setShowToast(true);

      // 수정 성공 후 3초 후 원래 페이지로 이동
      setTimeout(() => {
        router.push(`/category/${getCategorySlug(updatedPost.category)}`);
      }, 3000);
    } catch (error) {
      console.error('게시글 수정 오류:', error);
      setToastMessage('게시글 수정 중 오류가 발생했습니다.');
      setToastType('error');
      setShowToast(true);
      setLoading(false);
      throw error;
    }
  };

  // 카테고리 문자열을 URL 슬러그로 변환
  const getCategorySlug = (category: string): string => {
    switch (category) {
      case '아이디어':
        return 'idea';
      case '문장':
        return 'sentence';
      case '명언':
        return 'quote';
      case '영상':
        return 'video';
      case '기타':
        return 'other';
      default:
        return '';
    }
  };

  if (loading && !post) {
    return (
      <div className="w-full max-w-full">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500">게시글을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="w-full max-w-full">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-red-500">
            {error || '게시글을 찾을 수 없습니다.'}
          </p>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            뒤로 가기
          </button>
        </div>
      </div>
    );
  }

  // 초기 데이터 구성
  const initialData: CreatePostData = {
    title: post.title,
    content: post.content,
    category: post.category,
    keywords: post.keywords || [],
  };

  return (
    <div className="w-full max-w-full">
      <h1 className="text-2xl font-bold mb-6">게시글 수정</h1>
      <PostForm
        onSubmit={handleUpdatePost}
        initialData={initialData}
        isEdit={true}
      />

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
