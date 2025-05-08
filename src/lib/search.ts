import { Post } from '@/types';
import { supabase } from './supabase';
import { formatPostForClient } from '@/utils/data';


export interface SearchResult {
  titleResults: Post[];
  keywordResults: Post[];
  allResults: Post[];
  resultCounts: {
    all: number;
    title: number;
    keyword: number;
  };
}

export async function searchWithMultipleTerms(searchTerms: string[]): Promise<SearchResult> {
  if (!searchTerms.length) {
    return {
      titleResults: [],
      keywordResults: [],
      allResults: [],
      resultCounts: { all: 0, title: 0, keyword: 0 }
    };
  }

  try {
    // 제목 검색 (ILIKE 사용)
    const titleSearchPromises = searchTerms.map(term => {
      return supabase
        .from('posts')
        .select('*')
        .ilike('title', `%${term}%`);
    });

    // 내용 검색 (ILIKE 사용)
    const contentSearchPromises = searchTerms.map(term => {
      return supabase
        .from('posts')
        .select('*')
        .ilike('content', `%${term}%`);
    });

    // 키워드 검색
    const keywordSearchPromises = searchTerms.map(term => {
      return supabase
        .from('posts')
        .select('*')
        .contains('keywords', [term]);
    });

    // 모든 검색 결과를 병렬로 가져오기
    const results = await Promise.all([
      ...titleSearchPromises,
      ...contentSearchPromises,
      ...keywordSearchPromises
    ]);

    // 검색 결과 병합 및 중복 제거
    const titleResults: Post[] = [];
    const contentResults: Post[] = [];
    const keywordResults: Post[] = [];

    // 제목 검색 결과 처리
    results.slice(0, searchTerms.length).forEach(result => {
      if (result.error) {
        console.error('제목 검색 오류:', result.error);
        return;
      }

      // 중복 제거하며 결과 추가
      result.data.forEach((post) => {
        if (post && !titleResults.some((p) => p.id === post.id)) {
          const formattedPost = formatPostForClient(post);
          if (formattedPost) {
            titleResults.push(formattedPost);
          }
        }
      });
    });

    // 내용 검색 결과 처리
    results.slice(searchTerms.length, searchTerms.length * 2).forEach(result => {
      if (result.error) {
        console.error('내용 검색 오류:', result.error);
        return;
      }

      // 중복 제거하며 결과 추가 (제목 결과와도 중복 제거)
      result.data.forEach((post) => {
        if (post && !contentResults.some(p => p.id === post.id) && !titleResults.some(p => p.id === post.id)) {
          const formattedPost = formatPostForClient(post);
          if (formattedPost) {
            contentResults.push(formattedPost);
          }
        }
      });
    });

    // 키워드 검색 결과 처리
    results.slice(searchTerms.length * 2).forEach(result => {
      if (result.error) {
        console.error('키워드 검색 오류:', result.error);
        return;
      }

      // 중복 제거하며 결과 추가
      result.data.forEach((post) => {
        if (post && !keywordResults.some(p => p.id === post.id) && 
            !titleResults.some(p => p.id === post.id) && 
            !contentResults.some(p => p.id === post.id)) {
          const formattedPost = formatPostForClient(post);
          if (formattedPost) {
            keywordResults.push(formattedPost);
          }
        }
      });
    });

    // 제목과 내용 결과 합치기 (제목 우선)
    const titleAndContentResults = [...titleResults, ...contentResults];

    // 전체 결과 개수 계산
    const resultCounts = {
      all: titleAndContentResults.length + keywordResults.length,
      title: titleResults.length,
      keyword: keywordResults.length
    };

    return {
      titleResults: titleAndContentResults, // 제목 탭에는 제목+내용 결과 표시
      keywordResults,
      allResults: [...titleAndContentResults, ...keywordResults],
      resultCounts
    };
  } catch (error) {
    console.error('검색 중 오류 발생:', error);
    throw error;
  }
}