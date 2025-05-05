export enum PostCategory {
  IDEA = '아이디어',
  SENTENCE = '문장',
  QUOTE = '명언',
  VIDEO = '영상',
  OTHER = '기타'
}

export interface Post {
  id: string;
  title: string;
  content: string;
  category: PostCategory;
  createdAt: string;
  keywords?: string[];
}

// Omit을 사용한 타입 명시적 정의
export type CreatePostData = Omit<Post, 'id' | 'createdAt'>;