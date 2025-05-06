// 실제로는 데이터베이스에 저장

import { supabase } from '@/lib/supabase';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
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
    return NextResponse.json(data);
  }
}

export async function POST(request: Request) {
  const body = await request.json();

  const { data, error } = await supabase
    .from('posts')
    .insert([body])
    .select()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data[0]);
}