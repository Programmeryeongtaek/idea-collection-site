import { createClient } from '@supabase/supabase-js';

// Supabase 클라이언트 생성
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 현재 로그인한 사용자 정보 가져오기
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

// 임시 사용자 ID 생성 (회원가입 전 사용)
export function getOrCreateGuestId() {
  let guestId = localStorage.getItem('guest_id');
  
  if (!guestId) {
    guestId = `guest_${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem('guest_id', guestId);
  }
  
  return guestId;
}

// 실제 사용자 ID 또는 게스트 ID 가져오기
export async function getUserId() {
  const user = await getCurrentUser();
  return user?.id || getOrCreateGuestId();
}