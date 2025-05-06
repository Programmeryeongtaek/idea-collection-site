'use client';

import Toast from '@/components/Toast';
import { deletePost, getPostById } from '@/lib/api';
import { Post } from '@/types';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PostDetailPage() {
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
  const [isDeleting, setIsDeleting] = useState(false);

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
        setError('게시글을 불러오는데 실패헀습니다.');
      } finally {
        setLoading(false);
      }
    }

    loadPost();
  }, [postId]);

  const handleDelete = async () => {
    if (!post || !confirm('정말로 이 게시글을 삭제하시겠습니까?')) return;

    setIsDeleting(true);
    try {
      const success = await deletePost(postId);

      if (success) {
        setToastMessage('게시글이 성공적으로 삭제되었습니다.');
        setToastType('success');
        setShowToast(true);

        // 삭제 성공 후 3초 후 원래 페이지로 이동
        setTimeout(() => {
          router.push('/');
        }, 3000);
      } else {
        throw new Error('게시글 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('게시글 삭제 오류:', error);
      setToastMessage('게시글 삭제 중 오류가 발생했습니다.');
      setToastType('error');
      setShowToast(true);
    } finally {
      setIsDeleting(false);
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

  if (loading) {
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

  return (
    <div className="w-full max-w-full">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href={`/category/${getCategorySlug(post.category)}`}
          className="text-indigo-600 hover:text-indigo-800"
        >
          ← {post.category} 목록으로 돌아가기
        </Link>

        <div className="flex space-x-2">
          <Link
            href={`/edit/${post.id}`}
            className={`px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 ${
              isDeleting ? 'pointer-events-none opacity-50' : ''
            }`}
          >
            수정
          </Link>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
            disabled={isDeleting}
          >
            {isDeleting ? '삭제 중...' : '삭제'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8 w-full border border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">{post.title}</h1>
          <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
            {post.category}
          </span>
        </div>

        <div className="text-gray-800 mb-6 whitespace-pre-wrap leading-relaxed">
          {post.content}
        </div>

        {/* 키워드 표시 */}
        {post.keywords && post.keywords.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-4 mb-2">
            {post.keywords.map((keyword, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 bg-gray-100 rounded-full text-xs text-gray-600"
              >
                #{keyword}
              </span>
            ))}
          </div>
        )}

        <p className="text-gray-500 text-sm mt-4">
          {new Date(post.created_at || post.createdAt || '').toLocaleString(
            'ko-KR'
          )}
        </p>
      </div>

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
