export enum PostCategory {
  IDEA = '아이디어',
  SENTENCE = '문장', // 기본값이지만 UI에는 표시하지 않음
  QUOTE = '명언', // 문장의 서브 카테고리
  VIDEO = '영상'
}

export interface Post {
  id: string;
  title: string;
  content: string;
  category: PostCategory;
  createdAt: string;
}

export type CreatePostData = Omit<Post, 'id' | 'createdAt'>;