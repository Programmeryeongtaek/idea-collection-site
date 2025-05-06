import { Post, PostCategory } from '@/types';

// 데이터베이스 응답 타입 정의
interface SupabasePost {
  id: string;
  title: string;
  content: string;
  category: PostCategory;
  created_at: string;
  keywords?: string[];
}

// Supabase의 created_at과 클라이언트의 createdAt을 상호 변환하는 함수
export function formatPostForClient(post: SupabasePost): Post {
  return {
    ...post,
    createdAt: post.created_at, // created_at을 createdAt으로 복사
  };
}

export function formatPostForSupabase(post: Post): SupabasePost {
  const { createdAt, ...rest } = post;
  return {
    ...rest,
    created_at: post.created_at || createdAt || new Date().toISOString(), // createdAt을 created_at으로 설정
  } as SupabasePost;
}

// 여러 게시글을 한 번에 변환
export function formatPostsForClient(posts: SupabasePost[]): Post[] {
  return posts.map(formatPostForClient);
}

export function formatPostsForSupabase(posts: Post[]): SupabasePost[] {
  return posts.map(formatPostForSupabase);
}