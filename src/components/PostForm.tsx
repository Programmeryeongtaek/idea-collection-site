'use client';

import { CreatePostData, PostCategory } from '@/types';
import Link from 'next/link';
import { FC, FormEvent, KeyboardEvent, useState } from 'react';
import Toast from './Toast';

interface PostFormProps {
  onSubmit: (post: CreatePostData) => Promise<void>;
  initialData?: CreatePostData; // 초기 데이터 추가
  isEdit?: boolean; // 수정 모드 여부
  initialLoading?: boolean;
}

// 비디오 카테고리 제출 데이터
interface VideoPostData {
  title: string;
  content: string;
  category: PostCategory.VIDEO;
  keywords?: string[];
  video_urls: string[];
}

// 비디오가 아닌 카테고리 제출 데이터
interface NonVideoPostData {
  title: string;
  content: string;
  category: Exclude<PostCategory, PostCategory.VIDEO>;
  keywords?: string[];
}

// 조합 타입
type PostSubmitData = VideoPostData | NonVideoPostData;

const PostForm: FC<PostFormProps> = ({
  onSubmit,
  initialData,
  isEdit = false,
  initialLoading = false,
}) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [category, setCategory] = useState<PostCategory | null>(
    initialData?.category || null
  );
  const [videoUrls, setVideoUrls] = useState<string[]>(
    initialData?.category === PostCategory.VIDEO &&
      Array.isArray(initialData.video_urls)
      ? initialData.video_urls
      : []
  );
  const [currentVideoUrl, setCurrentVideoUrl] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<
    'info' | 'success' | 'warning' | 'error'
  >('warning');
  const [loading, setLoading] = useState(initialLoading);

  // 키워드 관련 상태
  const [keywords, setKeywords] = useState<string[]>(
    initialData?.keywords || []
  );
  const [keywordInput, setKeywordInput] = useState('');

  // URL 검증 함수
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // 영상 URL 추가
  const addVideoUrl = () => {
    if (!currentVideoUrl.trim()) {
      return;
    }

    // URL 형식 검증
    if (!isValidUrl(currentVideoUrl)) {
      setToastMessage('유효한 URL을 입력해주세요.');
      setToastType('warning');
      setShowToast(true);
      return;
    }

    // 최대 5개 제한
    if (videoUrls.length >= 5) {
      setToastMessage('영상 URL은 최대 5개까지만 추가할 수 있습니다.');
      setToastType('warning');
      setShowToast(true);
      return;
    }

    // 중복 검사
    if (videoUrls.includes(currentVideoUrl)) {
      setToastMessage('이미 추가된 URL입니다.');
      setToastType('info');
      setShowToast(true);
      return;
    }

    // URL 추가
    setVideoUrls([...videoUrls, currentVideoUrl]);
    setCurrentVideoUrl('');
  };

  // 영상 URL 삭제
  const removeVideoUrl = (indexToRemove: number) => {
    setVideoUrls(videoUrls.filter((_, index) => index !== indexToRemove));
  };

  // URL 입력창에서 엔터 키 처리
  const handleVideoUrlKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // 폼 제출 방지
      addVideoUrl();
    }
  };

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

    // 영상 카테고리일 때 URL 필수 입력 검증
    if (category === PostCategory.VIDEO && videoUrls.length === 0) {
      setToastMessage('영상 카테고리에는 최소 1개 이상의 URL을 입력해주세요.');
      setToastType('warning');
      setShowToast(true);
      return;
    }

    setLoading(true);

    try {
      // 제출 데이터 준비
      let postData: PostSubmitData;

      // 영상 카테고리인 경우
      if (category === PostCategory.VIDEO) {
        postData = {
          title,
          content,
          category,
          keywords: keywords.length > 0 ? keywords : undefined,
          video_urls: videoUrls,
        };
      } else {
        // 영상이 아닌 카테고리
        postData = {
          title,
          content,
          category,
          keywords: keywords.length > 0 ? keywords : undefined,
        };
      }

      // 제출
      await onSubmit(postData as CreatePostData);
    } catch (error) {
      console.error('게시글 저장 중 오류:', error);
      setToastMessage('게시글 저장 중 오류가 발생했습니다.');
      setToastType('error');
      setShowToast(true);
      setLoading(false);
    }
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

        {/* 영상 카테고리 선택 시 URL 입력 필드 표시 */}
        {category === PostCategory.VIDEO && (
          <div className="transition-all duration-300 ease-in-out space-y-4">
            <div>
              <div className="flex justify-between">
                <label className="block text-sm font-medium text-gray-700">
                  영상 URL (최대 5개)
                </label>
                <span className="text-xs text-gray-500">
                  {videoUrls.length}/5 영상 추가됨
                </span>
              </div>
              <div className="mt-1 flex">
                <input
                  type="url"
                  value={currentVideoUrl}
                  onChange={(e) => setCurrentVideoUrl(e.target.value)}
                  onKeyPress={handleVideoUrlKeyPress}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="flex-1 rounded-l-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  disabled={loading || videoUrls.length >= 5}
                />
                <button
                  type="button"
                  onClick={addVideoUrl}
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-r-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300"
                  disabled={
                    loading || !currentVideoUrl.trim() || videoUrls.length >= 5
                  }
                >
                  추가
                </button>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                YouTube, Vimeo 등의 영상 URL을 입력하세요. (필수)
              </p>
            </div>

            {/* 추가된 영상 URL 목록 */}
            {videoUrls.length > 0 && (
              <div className="bg-gray-50 p-3 rounded-md">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  추가된 영상
                </h4>
                <ul className="space-y-2">
                  {videoUrls.map((url, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between bg-white p-2 rounded border border-gray-200"
                    >
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-800 text-sm truncate max-w-[80%]"
                      >
                        {url}
                      </a>
                      <button
                        type="button"
                        onClick={() => removeVideoUrl(index)}
                        className="text-red-500 hover:text-red-700"
                        disabled={loading}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

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
            {loading ? '저장 중...' : isEdit ? '수정하기' : '게시하기'}
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
