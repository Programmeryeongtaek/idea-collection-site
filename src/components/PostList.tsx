'use client';

import {
  deleteMultiplePosts,
  getAllPosts,
  getPostsByCategory,
} from '@/lib/api';
import { Post, PostCategory } from '@/types';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Toast from './Toast';

interface PostListProps {
  category: PostCategory | null; // null은 모든 카테고리
}

export default function PostList({ category }: PostListProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPosts, setSelectedPosts] = useState<Set<string>>(new Set());
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<
    'info' | 'success' | 'warning' | 'error'
  >('info');

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
      } catch (err) {
        console.error('게시글을 불러오는 중 오류 발생:', err);
        setError('게시글을 불러오는데 실패했습니다. 다시 시도해주세요.');
      } finally {
        setLoading(false);
      }
    }

    loadPosts();
  }, [category]);

  // 항목 선택/해제 처리
  const toggleSelection = (postId: string) => {
    setSelectedPosts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  // 전체 선택/해제
  const toggleSelectAll = () => {
    if (selectedPosts.size === posts.length) {
      // 전체 해제
      setSelectedPosts(new Set());
    } else {
      // 전체 선택
      const allIds = posts.map((post) => post.id);
      setSelectedPosts(new Set(allIds));
    }
  };

  // 다중 삭체 처리
  const handleMultipleDelete = async () => {
    if (selectedPosts.size === 0) {
      setToastMessage('선택한 게시글이 없습니다.');
      setToastType('warning');
      setShowToast(true);
      return;
    }

    if (
      !confirm(
        `선택한 ${selectedPosts.size}개의 게시글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      const postIds = Array.from(selectedPosts);
      const result = await deleteMultiplePosts(postIds);

      if (result.success) {
        // 로컬 상태에서도 삭제된 게시글 제거
        setPosts((prev) => prev.filter((post) => !selectedPosts.has(post.id)));

        setToastMessage(
          `${result.count}개의 게시글이 성공적으로 삭제되었습니다.`
        );
        setToastType('success');
        setShowToast(true);

        // 선택 항목 초기화
        setSelectedPosts(new Set());
      } else {
        throw new Error('게시글 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('게시글 다중 삭제 오류:', error);
      setToastMessage('게시글 삭제 중 오류가 발생했습니다.');
      setToastType('error');
      setShowToast(true);
    } finally {
      setIsDeleting(false);
    }
  };

  // 선택 모드 토글
  const toggleMultiSelectMode = () => {
    if (isMultiSelectMode) {
      // 선택 모드 종료 시 선택 항목 초기화
      setSelectedPosts(new Set());
    }
    setIsMultiSelectMode(!isMultiSelectMode);
  };

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
      {/* 다중 선택 컨트롤 */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <button
            onClick={toggleMultiSelectMode}
            className={`px-3 py-1 rounded-md text-sm ${
              isMultiSelectMode
                ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {isMultiSelectMode ? '선택 모드 종료' : '다중 선택 모드'}
          </button>

          {isMultiSelectMode && (
            <>
              <button
                onClick={toggleSelectAll}
                className="px-3 py-1 bg-gray-100 rounded-md text-sm text-gray-700 hover:bg-gray-200"
              >
                {selectedPosts.size === posts.length
                  ? '전체 해제'
                  : '전체 선택'}
              </button>

              <button
                onClick={handleMultipleDelete}
                className="px-3 py-1 bg-red-600 text-white rounded-md text-sm hover:bg-red-700 disabled:opacity-50"
                disabled={selectedPosts.size === 0 || isDeleting}
              >
                {isDeleting
                  ? '삭제 중...'
                  : `선택한 ${selectedPosts.size}개 항목 삭제`}
              </button>
            </>
          )}
        </div>
      </div>

      {posts.map((post) => {
        const isSelected = selectedPosts.has(post.id);

        return (
          <div
            key={post.id}
            className={`bg-white rounded-lg shadow p-6 w-full border ${
              isSelected
                ? 'border-indigo-300 ring-2 ring-indigo-100'
                : 'border-gray-100'
            }`}
          >
            <div className="flex items-start">
              {/* 선택 체크박스 */}
              {isMultiSelectMode && (
                <div className="mr-4 pt-1">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleSelection(post.id)}
                    className="h-5 w-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                  />
                </div>
              )}

              <Link href={`/post/${post.id}`} className="flex-1">
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
                  {new Date(
                    post.created_at || post.createdAt || ''
                  ).toLocaleString('ko-KR')}
                </p>
              </Link>
            </div>
          </div>
        );
      })}

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
