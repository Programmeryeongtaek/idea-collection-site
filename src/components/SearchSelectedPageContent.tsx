'use client';

import { Post } from '@/types';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import HighlightText from './HightText';

// 검색 결과 탭 타입
type SearchTabType = 'all' | 'title' | 'keyword';
type ViewMode = 'search' | 'fullContent';

export default function SearchSelectedPageContent() {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get('term') || '';

  // 검색 결과
  const [titleResults, setTitleResults] = useState<Post[]>([]);
  const [keywordResults, setKeywordResults] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<SearchTabType>('all');
  const [resultCounts, setResultCounts] = useState({
    all: 0,
    title: 0,
    keyword: 0,
  });

  // 다중 선택 관련 상태
  const [selectedPosts, setSelectedPosts] = useState<Set<string>>(new Set());
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);
  const [showSelectedOnly, setShowSelectedOnly] = useState(false);

  // 보기 모드 상태
  const [viewMode, setViewMode] = useState<ViewMode>('search');
  const [selectedPostsData, setSelectedPostsData] = useState<Post[]>([]);

  // 검색 실행
  useEffect(() => {
    if (!searchTerm) return;

    // 로컬 스토리지에서 게시글 가져오기
    const savedPosts = JSON.parse(
      localStorage.getItem('posts') || '[]'
    ) as Post[];

    // 제목으로 검색
    const titleMatches = savedPosts.filter((post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setTitleResults(titleMatches);

    // 키워드로 검색
    const keywordMatches = savedPosts.filter(
      (post) =>
        post.keywords?.some((keyword) =>
          keyword.toLowerCase().includes(searchTerm.toLowerCase())
        ) ?? false
    );
    setKeywordResults(keywordMatches);

    // 중복 제거한 전체 결과 개수 계산
    const allResultsCount = new Set([
      ...titleMatches.map((post) => post.id),
      ...keywordMatches.map((post) => post.id),
    ]).size;

    // 결과 개수 설정
    setResultCounts({
      all: allResultsCount,
      title: titleMatches.length,
      keyword: keywordMatches.length,
    });

    // 선택 항목 초기화
    setSelectedPosts(new Set());
    setShowSelectedOnly(false);
    setViewMode('search');
  }, [searchTerm]);

  // 선택한 항목들의 데이터를 로드
  useEffect(() => {
    if (selectedPosts.size === 0) {
      setSelectedPostsData([]);
      return;
    }

    // 로컬 스토리지에서 게시글 가져오기
    const savedPosts = JSON.parse(
      localStorage.getItem('posts') || '[]'
    ) as Post[];

    // 선택한 ID에 해당하는 게시글만 필터링
    const filteredPosts = savedPosts.filter((post) =>
      selectedPosts.has(post.id)
    );
    setSelectedPostsData(filteredPosts);
  }, [selectedPosts]);

  // 현재 탭에 맞는 결과 필터링 및 정렬
  const getFilteredResults = () => {
    let results: Post[] = [];

    switch (activeTab) {
      case 'title':
        results = titleResults;
        break;
      case 'keyword':
        results = keywordResults;
        break;
      case 'all':
      default:
        // 전체 결과 - 중복 제거 및 우선순위 정렬
        const allResults = [...titleResults];

        // 키워드 결과 중 제목 결과에 없는 것만 추가
        keywordResults.forEach((post) => {
          if (!allResults.some((p) => p.id === post.id)) {
            allResults.push(post);
          }
        });

        // 우선순위 정렬: 제목+키워드 둘 다 매치 > 제목 매치 > 키워드 매치
        results = allResults.sort((a, b) => {
          const aMatchesTitle = titleResults.some((p) => p.id === a.id);
          const aMatchesKeyword = keywordResults.some((p) => p.id === a.id);
          const bMatchesTitle = titleResults.some((p) => p.id === b.id);
          const bMatchesKeyword = keywordResults.some((p) => p.id === b.id);

          // 둘 다 매치하는 경우가 가장 우선순위 높음
          if (
            aMatchesTitle &&
            aMatchesKeyword &&
            !(bMatchesTitle && bMatchesKeyword)
          ) {
            return -1;
          }
          if (
            bMatchesTitle &&
            bMatchesKeyword &&
            !(aMatchesTitle && aMatchesKeyword)
          ) {
            return 1;
          }

          // 그 다음은 제목 매치가 우선
          if (aMatchesTitle && !bMatchesTitle) {
            return -1;
          }
          if (bMatchesTitle && !aMatchesTitle) {
            return 1;
          }

          // 최신순 정렬 (기본)
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        });
    }

    // 선택한 항목만 보기 필터링
    if (showSelectedOnly) {
      results = results.filter((post) => selectedPosts.has(post.id));
    }

    return results;
  };

  const currentResults = getFilteredResults();

  // 항목 선택/해제 처리
  const toggleSelection = (postId: string) => {
    const newSelected = new Set(selectedPosts);
    if (newSelected.has(postId)) {
      newSelected.delete(postId);
    } else {
      newSelected.add(postId);
    }
    setSelectedPosts(newSelected);
  };

  // 전체 선택/해제
  const toggleSelectAll = () => {
    if (selectedPosts.size === currentResults.length) {
      // 전체 해제
      setSelectedPosts(new Set());
    } else {
      // 전체 선택
      const newSelected = new Set<string>();
      currentResults.forEach((post) => {
        newSelected.add(post.id);
      });
      setSelectedPosts(newSelected);
    }
  };

  // 선택 모드 토글
  const toggleMultiSelectMode = () => {
    if (isMultiSelectMode) {
      // 선택 모드 종료 시 선택 항목 초기화
      setSelectedPosts(new Set());
      setShowSelectedOnly(false);
      setViewMode('search');
    }
    setIsMultiSelectMode(!isMultiSelectMode);
  };

  return (
    <div className="w-full max-w-full">
      {viewMode === 'search' ? (
        // 검색 결과 보기
        <>
          <div className="mb-6">
            <h1 className="text-2xl font-bold">검색 결과</h1>
            <p className="text-gray-600 mt-1">
              검색어: {searchTerm} (총 {resultCounts.all}개의 결과)
            </p>
          </div>

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
                    {selectedPosts.size === currentResults.length
                      ? '전체 해제'
                      : '전체 선택'}
                  </button>

                  <button
                    onClick={() => setShowSelectedOnly(!showSelectedOnly)}
                    className={`px-3 py-1 rounded-md text-sm ${
                      showSelectedOnly
                        ? 'bg-blue-100 text-blue-700 border border-blue-300'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {showSelectedOnly ? '모든 결과 보기' : '선택한 항목만 보기'}
                  </button>
                </>
              )}
            </div>

            {isMultiSelectMode && selectedPosts.size > 0 && (
              <span className="text-sm text-gray-600">
                {selectedPosts.size}개 선택됨
              </span>
            )}
          </div>

          {/* 선택한 항목 모아보기 */}
          {isMultiSelectMode && selectedPosts.size > 0 && (
            <div className="mb-6">
              <button
                onClick={() => setViewMode('fullContent')}
                className="w-full py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium"
              >
                선택한 {selectedPosts.size}개 항목 모아보기
              </button>
            </div>
          )}

          {/* 탭 메뉴 */}
          <div className="border-b border-gray-200 mb-4">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('all')}
                className={`mr-6 py-4 px-1 ${
                  activeTab === 'all'
                    ? 'border-b-2 border-indigo-500 text-indigo-600'
                    : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                전체 ({resultCounts.all})
              </button>

              <button
                onClick={() => setActiveTab('title')}
                className={`mr-6 py-4 px-1 ${
                  activeTab === 'title'
                    ? 'border-b-2 border-indigo-500 text-indigo-600'
                    : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                제목 ({resultCounts.title})
              </button>

              <button
                onClick={() => setActiveTab('keyword')}
                className={`mr-6 py-4 px-1 ${
                  activeTab === 'keyword'
                    ? 'border-b-2 border-indigo-500 text-indigo-600'
                    : 'border-b-2 border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                키워드 ({resultCounts.keyword})
              </button>
            </nav>
          </div>

          {/* 검색 결과 */}
          {currentResults.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6 text-center">
              <p className="text-gray-500">검색 결과가 없습니다.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {currentResults.map((post) => {
                const matchesTitle = titleResults.some((p) => p.id === post.id);
                const matchesKeyword = keywordResults.some(
                  (p) => p.id === post.id
                );
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

                      <div className="flex-1">
                        {/* 매치 정보 표시 (전체 탭에서만) */}
                        {activeTab === 'all' && (
                          <div className="flex mb-2 gap-1">
                            {matchesTitle && (
                              <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                                제목 일치
                              </span>
                            )}
                            {matchesKeyword && (
                              <span className="px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">
                                키워드 일치
                              </span>
                            )}
                          </div>
                        )}

                        <div className="flex justify-between items-center mb-3">
                          <h3 className="text-xl font-medium">
                            {matchesTitle ? (
                              <HighlightText
                                text={post.title}
                                highlight={searchTerm}
                                highlightClassName="bg-yellow-200"
                              />
                            ) : (
                              post.title
                            )}
                          </h3>
                          <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                            {post.category}
                          </span>
                        </div>

                        <p className="text-gray-700 mb-4 line-clamp-3">
                          {post.content}
                        </p>

                        {/* 키워드 표시 - 키워드가 있을 때만 */}
                        {post.keywords && post.keywords.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-3 mb-2">
                            {post.keywords.map((keyword, index) => {
                              const isHighlighted =
                                matchesKeyword &&
                                keyword
                                  .toLowerCase()
                                  .includes(searchTerm.toLowerCase());

                              return (
                                <span
                                  key={index}
                                  className={`px-2 py-0.5 rounded-full text-xs ${
                                    isHighlighted
                                      ? 'bg-yellow-200 text-yellow-800 font-medium'
                                      : 'bg-gray-100 text-gray-600'
                                  }`}
                                >
                                  #{keyword}
                                </span>
                              );
                            })}
                          </div>
                        )}

                        <p className="text-gray-500 text-sm mt-2">
                          {new Date(post.created_at).toLocaleString('ko-KR')}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        // 선택한 항목 모아보기
        <div className="print:p-0">
          <div className="mb-6 flex items-center justify-between print:hidden">
            <button
              onClick={() => setViewMode('search')}
              className="text-indigo-600 hover:text-indigo-800"
            >
              ← 검색 결과로 돌아가기
            </button>

            <div className="text-sm text-gray-600">
              선택한 {selectedPostsData.length}개 항목
            </div>
          </div>

          {/* 선택한 게시글 모음 */}
          <div className="space-y-8 print:space-y-12">
            {selectedPostsData.map((post, index) => (
              <div
                key={post.id}
                className="bg-white rounded-lg shadow-lg p-8 w-full border border-gray-100 print:shadow-none print:break-inside-avoid"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold">
                    {searchTerm ? (
                      <HighlightText
                        text={post.title}
                        highlight={searchTerm}
                        highlightClassName="bg-yellow-200"
                      />
                    ) : (
                      post.title
                    )}
                  </h2>
                  <span className="px-3 py-1 bg-gray-100 rounded-full text-sm print:bg-gray-200">
                    {post.category}
                  </span>
                </div>

                <div className="text-gray-800 mb-4 whitespace-pre-wrap leading-relaxed">
                  {post.content}
                </div>

                {/* 키워드 표시 - 키워드가 있을 때만 */}
                {post.keywords && post.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-4 mb-2">
                    {post.keywords.map((keyword, idx) => (
                      <span
                        key={idx}
                        className={`px-2 py-0.5 rounded-full text-xs ${
                          searchTerm &&
                          keyword
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase())
                            ? 'bg-yellow-200 text-yellow-800 font-medium'
                            : 'bg-gray-100 text-gray-600 print:bg-gray-200'
                        }`}
                      >
                        #{keyword}
                      </span>
                    ))}
                  </div>
                )}

                <p className="text-gray-500 text-sm mt-4">
                  {new Date(post.created_at).toLocaleString('ko-KR')}
                </p>

                {/* 항목 구분선 - 마지막 항목 제외 */}
                {index < selectedPostsData.length - 1 && (
                  <div className="mt-8 border-b border-gray-200 print:border-gray-400"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
