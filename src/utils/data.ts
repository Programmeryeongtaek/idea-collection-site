import { Post, PostCategory } from '@/types';

// 데이터베이스 응답 타입 정의
interface BaseSupabasePost {
  id: string;
  title: string;
  content: string;
  category: PostCategory;
  created_at: string;
  keywords?: string[];
}

// 영상 카테고리용 Supabase 게시글 타입
interface SupabaseVideoPost extends BaseSupabasePost {
  category: PostCategory.VIDEO;
  video_urls: string[]; // videoUrls가 아닌 video_urls 사용
}

// 비영상 카테고리용 Supabase 게시글 타입
interface SupabaseNonVideoPost extends BaseSupabasePost {
  category: Exclude<PostCategory, PostCategory.VIDEO>;
  video_urls?: never;
}

// 통합 타입
type SupabasePost = SupabaseVideoPost | SupabaseNonVideoPost;

// Supabase → 클라이언트 포맷 변환 함수
export function formatPostForClient(post: SupabasePost | null): Post | null {
  if (!post) return null;
  
  // 기본 필드 복사
  const baseClientPost = {
    id: post.id,
    title: post.title,
    content: post.content,
    category: post.category,
    created_at: post.created_at,
    keywords: post.keywords || [],
  };
  
  // 카테고리에 따라 다른 객체 반환
  if (post.category === PostCategory.VIDEO) {
    return {
      ...baseClientPost,
      category: PostCategory.VIDEO,
      video_urls: post.video_urls || [], // 스네이크 케이스를 카멜 케이스로 변환
    } as Post;
  } else {
    return baseClientPost as Post;
  }
}

// 클라이언트 → Supabase 변환 시
export function formatPostForSupabase(post: Post): SupabasePost {
  // 기본 객체 생성
  const basePost: BaseSupabasePost = {
    id: post.id,
    title: post.title,
    content: post.content,
    category: post.category,
    created_at: post.created_at,
    keywords: post.keywords || [],
  };
  
  // 카테고리에 따라 다른 객체 반환
  if (post.category === PostCategory.VIDEO && 'videoUrls' in post) {
    return {
      ...basePost,
      category: PostCategory.VIDEO,
      video_urls: post.videoUrls, // 필드명 수정: videoUrls → video_urls
    } as SupabaseVideoPost;
  } else {
    return basePost as SupabaseNonVideoPost;
  }
}

// 여러 게시글을 한 번에 변환
export function formatPostsForClient(posts: SupabasePost[]): Post[] {
  // null 값을 필터링하고 타입 단언을 사용
  return posts.map(post => formatPostForClient(post))
    .filter((post): post is Post => post !== null);
}

export function formatPostsForSupabase(posts: Post[]): SupabasePost[] {
  return posts.map(formatPostForSupabase);
}