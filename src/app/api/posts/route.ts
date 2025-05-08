import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const category = url.searchParams.get('category');
    const searchTerm = url.searchParams.get('search');
    const keyword = url.searchParams.get('keyword');

    let query = supabase.from('posts').select('*');

    if (category) {
      query = query.eq('category', category);
    }

    if (searchTerm) {
      query = query.textSearch('search_vector', searchTerm, {
        type: 'websearch',
        config: 'korean',
      });
    }

    if (keyword) {
      query = query.contains('keywords', [keyword]);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('데이터 조회 오류:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (error) {
    console.error('API 요청 처리 중 오류 발생:', error);
    
    // 에러 타입에 따른 처리
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    // 알 수 없는 에러 타입에 대한 처리
    return NextResponse.json({ error: '서버 오류가 발생했습니다' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from('posts')
      .insert([body])
      .select();

    if (error) {
      console.error('데이터 저장 오류:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data?.[0] || null);
  } catch (error) {
    console.error('API 요청 처리 중 오류 발생:', error);
    
    // 에러 타입에 따른 처리
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    // 알 수 없는 에러 타입에 대한 처리
    return NextResponse.json({ error: '서버 오류가 발생했습니다' }, { status: 500 });
  }
}