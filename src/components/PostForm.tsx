'use client';

import { CreatePostData, PostCategory } from '@/types';
import Link from 'next/link';
import { FC, FormEvent, KeyboardEvent, useState } from 'react';
import Toast from './Toast';
import { useRouter } from 'next/navigation';

interface PostFormProps {
  onSubmit: (post: CreatePostData) => void;
  initialLoading?: boolean;
}

const PostForm: FC<PostFormProps> = ({ onSubmit, initialLoading = false }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<PostCategory | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<
    'info' | 'success' | 'warning' | 'error'
  >('warning');
  const [loading, setLoading] = useState(initialLoading);
  const router = useRouter();

  // 키워드 관련 상태
  const [keywords, setKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // 카테고리 선택 확인
    if (!category) {
      setToastMessage(
        "카테고리를 선택해주세요. 선택하지 않으면 '기타'로 자동 분류됩니다."
      );
      setToastType('warning');
      setShowToast(true);
      return;
    }

    setLoading(true);

    try {
      await onSubmit({
        title,
        content,
        category: category || PostCategory.OTHER,
        keywords, // 키워드 배열 추가
      });

      // 카테고리에 따라 해당 페이지로 리다이렉트
      navigateToCategoryPage(category);
    } catch (error) {
      console.error('게시글 저장 중 오류:', error);
      setToastMessage('게시글 저장 중 오류가 발생했습니다.');
      setToastType('error');
      setShowToast(true);
      setLoading(false);
    }
  };

  const navigateToCategoryPage = (category: PostCategory) => {
    let redirectPath = '/';

    switch (category) {
      case PostCategory.IDEA:
        redirectPath = '/category/idea';
        break;
      case PostCategory.SENTENCE:
        redirectPath = '/category/sentence';
        break;
      case PostCategory.QUOTE:
        redirectPath = '/category/quote';
        break;
      case PostCategory.VIDEO:
        redirectPath = '/category/video';
        break;
      case PostCategory.OTHER:
        redirectPath = '/category/other';
        break;
    }

    // 게시글 작성 완료 후 해당 카테고리 페이지로 이동
    setTimeout(() => {
      router.push(redirectPath);
    }, 300);
  };

  // 키워드 추가 함수
  const addKeyword = () => {
    const trimmedKeyword = keywordInput.trim();

    if (!trimmedKeyword) return;

    // 이미 존재하는 키워드인지 확인
    if (keywords.includes(trimmedKeyword)) {
      setToastMessage('이미 추가된 키워드입니다.');
      setToastType('info');
      setShowToast(true);
      return;
    }

    // 최대 10개 제한
    if (keywords.length >= 10) {
      setToastMessage('키워드는 최대 10개까지만 추가할 수 있습니다.');
      setToastType('warning');
      setShowToast(true);
      return;
    }

    setKeywords([...keywords, trimmedKeyword]);
    setKeywordInput('');
  };

  // 엔터 키로 키워드 추가
  const handleKeywordKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // 폼 제출 방지
      addKeyword();
    }
  };

  // 키워드 삭제
  const removeKeyword = (indexToRemove: number) => {
    setKeywords(keywords.filter((_, index) => index !== indexToRemove));
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="w-full space-y-4 bg-white shadow rounded-lg p-6"
      >
        {/* 기존 코드와 동일... */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            제목
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
            disabled={loading}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            카테고리 (필수 선택)
          </label>
          <div className="mt-1 flex flex-wrap gap-2">
            <button
              type="button"
              className={`px-3 py-1 rounded-full ${
                category === PostCategory.IDEA
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200'
              }`}
              onClick={() => setCategory(PostCategory.IDEA)}
              disabled={loading}
            >
              {PostCategory.IDEA}
            </button>

            <button
              type="button"
              className={`px-3 py-1 rounded-full ${
                category === PostCategory.SENTENCE
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200'
              }`}
              onClick={() => setCategory(PostCategory.SENTENCE)}
              disabled={loading}
            >
              {PostCategory.SENTENCE}
            </button>

            <button
              type="button"
              className={`px-3 py-1 rounded-full ${
                category === PostCategory.QUOTE
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200'
              }`}
              onClick={() => setCategory(PostCategory.QUOTE)}
              disabled={loading}
            >
              {PostCategory.QUOTE}
            </button>

            <button
              type="button"
              className={`px-3 py-1 rounded-full ${
                category === PostCategory.VIDEO
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200'
              }`}
              onClick={() => setCategory(PostCategory.VIDEO)}
              disabled={loading}
            >
              {PostCategory.VIDEO}
            </button>

            <button
              type="button"
              className={`px-3 py-1 rounded-full ${
                category === PostCategory.OTHER
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200'
              }`}
              onClick={() => setCategory(PostCategory.OTHER)}
              disabled={loading}
            >
              {PostCategory.OTHER}
            </button>
          </div>
        </div>

        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700"
          >
            내용
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={5}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
            disabled={loading}
          />
        </div>

        {/* 키워드 입력 섹션 */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            키워드 (최대 10개)
          </label>
          <div className="mt-1 flex">
            <input
              type="text"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyPress={handleKeywordKeyPress}
              className="flex-1 rounded-l-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="키워드를 입력하고 Enter 또는 추가 버튼을 클릭하세요"
              disabled={loading}
            />
            <button
              type="button"
              onClick={addKeyword}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-r-md text-white bg-indigo-600 hover:bg-indigo-700"
              disabled={loading}
            >
              추가
            </button>
          </div>

          {/* 키워드 태그 표시 */}
          {keywords.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {keywords.map((keyword, index) => (
                <div
                  key={index}
                  className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm text-gray-700"
                >
                  <span>{keyword}</span>
                  <button
                    type="button"
                    onClick={() => removeKeyword(index)}
                    className="ml-1 text-gray-500 hover:text-gray-700"
                    disabled={loading}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* 키워드 카운터 */}
          <div className="mt-1 text-xs text-gray-500">
            {keywords.length}/10 키워드 등록됨
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300"
            disabled={loading}
          >
            {loading ? '저장 중...' : '게시하기'}
          </button>
          <Link
            href="/"
            className={`inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 ${
              loading ? 'pointer-events-none opacity-50' : ''
            }`}
          >
            취소
          </Link>
        </div>
      </form>

      {/* 토스트 메시지 */}
      <Toast
        message={toastMessage}
        type={toastType}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </>
  );
};

export default PostForm;
