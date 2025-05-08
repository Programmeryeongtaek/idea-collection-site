import { supabase } from '@/lib/supabase';
import { Post } from '@/types';

export async function migrateLocalStorageToSupabase() {
  try {
    // 로컬 스토리지에서 데이터 가져오기
    const savedPosts = JSON.parse(localStorage.getItem('posts') || '[]') as Post[];

    if (savedPosts.length === 0) {
      console.log('마이그레이션할 데이터가 없습니다.');
      return { success: true, message: '마이그레이션할 데이터가 없습니다.' };
    }

    // 데이터 정제 (id와 createdAt은 Supabase에서 자동 생성
    const migratedPosts = savedPosts.map(post => ({
      title: post.title,
      content: post.content,
      category: post.category,
      keywords: post.keywords || [],
      created_at: post.created_at,
    }));

    // Supabase에 데이터 저장
    const { data, error } = await supabase
      .from('posts')
      .insert(migratedPosts);

    if (error) {
      console.error('마이그레이션 중 오류 발생:', error);
      return { success: false, message: `마이그레이션 실패: ${error.message}` };
    }

    console.log('마이그레이션 성공:', data);
    return { success: true, message: `${migratedPosts.length}개의 게시글이 성공적으로 마이그레이션 되었습니다.` };
  } catch (error) {
    console.error('마이그레이션 실패:', error);
    return { success: false, message: '마이그레이션 중 오류가 발생했습니다.' };
  }
}