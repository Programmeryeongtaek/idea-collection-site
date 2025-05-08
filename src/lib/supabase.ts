import { createClient } from '@supabase/supabase-js';

// 환경 변수 가져오기 및 유효성 검사
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 환경 변수가 없을 때 명확한 오류 메시지
if (!supabaseUrl) {
  console.error('NEXT_PUBLIC_SUPABASE_URL 환경 변수가 설정되지 않았습니다.');
}

if (!supabaseAnonKey) {
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY 환경 변수가 설정되지 않았습니다.');
}

// Supabase 클라이언트 생성
export const supabase = createClient(
  supabaseUrl || '', 
  supabaseAnonKey || ''
);