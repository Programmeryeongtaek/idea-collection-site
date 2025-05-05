// 실제로는 데이터베이스에 저장

import { Post } from '@/types';
import { NextResponse } from 'next/server';

// 임시로 메모리 저장소로 대체
let posts: Post[] = [];

export async function GET() {
  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  const newPost = await request.json();

  posts = [newPost, ...posts];

  return NextResponse.json(newPost, { status: 200 });
}