export enum PostCategory {
  IDEA = '아이디어',
  SENTENCE = '문장',
  QUOTE = '명언',
  VIDEO = '영상',
  OTHER = '기타'
}

export interface BasePost {
  id: string;
  title: string;
  content: string;
  category: PostCategory;
  created_at: string; // Supabase에서는 created_at 형식으로 사용
  keywords?: string[];
}

// 영상 카테고리일 때 필요한 추가 필드
interface VideoPost extends BasePost {
  category: PostCategory.VIDEO;
  video_urls: string[];
}

// 다른 카테고리일 때는 videoUrls 필드가 없음
interface NonVideoPost extends BasePost {
  category: Exclude<PostCategory, PostCategory.VIDEO>;
  video_urls?: never;
}

// Union 타입으로 통합
export type Post = VideoPost | NonVideoPost;

// Omit을 사용한 타입 명시적 정의
export type CreatePostData = Omit<Post, 'id' | 'created_at'>;