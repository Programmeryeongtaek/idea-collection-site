'use client';

import HighlightText from '@/components/HightText';
import { Post } from '@/types';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

// 검색 결과 탭 타입
type SearchTabType = 'all' | 'title' | 'keyword';

export default function SearchPage() {
  const searchParams = useSearchParams();
  const searchTerm = searchParams.get('term') || '';

  // 검색결과
  const [titleResults, setTitleResults] = useState<Post[]>([]);
  const [keywordResults, setKeywordResults] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<SearchTabType>('all');
  const [resultCounts, setResultCounts] = useState({
    all: 0,
    title: 0,
    keyword: 0,
  });

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
  }, [searchTerm]);

  // 현재 탭에 맞는 결과 필터링 및 정렬
  const getFilteredResults = () => {
    switch (activeTab) {
      case 'title':
        return titleResults;
      case 'keyword':
        return keywordResults;
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

        // 우선순위 정렬: 제목 + 키워드 둘 다 매치 > 제목 매치 > 키워드 매치
        return allResults.sort((a, b) => {
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
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });
    }
  };

  const currentResults = getFilteredResults();

  return (
    <div className="w-full max-w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">검색 결과</h1>
        <p className="text-gray-600 mt-1">
          검색어: {searchTerm} (총 {resultCounts.all}개의 결과)
        </p>
      </div>

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
            const matchesKeyword = keywordResults.some((p) => p.id === post.id);

            return (
              <div
                key={post.id}
                className="bg-white rounded-lg shadow p-6 w-full border border-gray-100"
              >
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

                <p className="text-gray-700 mb-4">{post.content}</p>

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
                  {new Date(post.createdAt).toLocaleString('ko-KR')}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
