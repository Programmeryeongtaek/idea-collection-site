
import { CreatePostData, Post, PostCategory } from '@/types';
import { supabase } from './supabase';
import { formatPostForClient, formatPostsForClient } from '@/utils/data';

// 모든 게시글 가져오기
export async function getAllPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts:', error);
    return [];
  }

  return formatPostsForClient(data || []);
}

// 카테고리별 게시글 가져오기
export async function getPostsByCategory(category: PostCategory): Promise<Post[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('category', category)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching posts by category:', error);
    return [];
  }

  return formatPostsForClient(data || []);
}

// 게시글 생성하기
export async function createPost(postData: CreatePostData): Promise<{post: Post | null, redirectUrl: string}> {
  try {
    const { data, error } = await supabase
      .from('posts')
      .insert([postData])
      .select()
      .single();

    if (error) {
      console.error('Error creating post:', error);
      throw error;
    }
    
    // 카테고리에 따른 리디렉션 URL 설정
    let redirectUrl = '/';
    if (postData.category === PostCategory.VIDEO) {
      redirectUrl = '/category/video';
    } else if (postData.category === PostCategory.IDEA) {
      redirectUrl = '/category/idea';
    } else if (postData.category === PostCategory.SENTENCE) {
      redirectUrl = '/category/sentence';
    } else if (postData.category === PostCategory.QUOTE) {
      redirectUrl = '/category/quote';
    } else if (postData.category === PostCategory.OTHER) {
      redirectUrl = '/category/other';
    }
    
    // data가 존재하는지 확인
    if (!data) {
      console.error('No data returned after insert');
      return { post: null, redirectUrl };
    }
    
    return { post: formatPostForClient(data), redirectUrl };
  } catch (error) {
    console.error('생성 오류:', error);
    throw error;
  } 
}

// 게시글 삭제하기
export async function deletePost(postId: string): Promise<boolean> {
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId);

  if (error) {
    console.error('Error deleting post:', error);
    return false;
  }

  return true;
}

// 다중 게시글 삭제하기
export async function deleteMultiplePosts(postIds: string[]): Promise<{success: boolean; count: number}> {
  // postIds가 비어있으면 바로 반환
  if (!postIds.length) {
    return { success: true, count: 0 };
  }

  const { data, error } = await supabase
    .from('posts')
    .delete()
    .in('id', postIds)
    .select('id');

  if (error) {
    console.error('Error deleting posts:', error);
    return { success: false, count: 0 };
  }

  return { success: true, count: data?.length || 0 };
}

// 게시글 수정하기
export async function updatePost(postId: string, postData: Partial<CreatePostData>): Promise<Post | null> {
  const { data, error } = await supabase
    .from('posts')
    .update(postData)
    .eq('id', postId)
    .select()
    .single();

  if (error) {
    console.error('Error updating post:', error);
    return null;
  }

  return formatPostForClient(data);
}

// 게시글 상세 정보 가져오기
export async function getPostById(postId: string): Promise<Post | null> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('id', postId)
    .single();

  if (error) {
    console.error('Error fetching post by id:', error);
    return null;
  }

  return formatPostForClient(data);
}