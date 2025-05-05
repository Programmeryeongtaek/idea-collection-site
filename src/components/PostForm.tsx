'use client';

import { CreatePostData, PostCategory } from '@/types';
import Link from 'next/link';
import { FC, FormEvent, useState } from 'react';

interface PostFormProps {
  onSubmit: (post: CreatePostData) => void;
}

const PostForm: FC<PostFormProps> = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<PostCategory>(PostCategory.SENTENCE); // 기본값은 '문장'

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      content,
      category,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          제목
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          카테고리
        </label>
        <div className="mt-1 flex flex-wrap gap-2">
          <button
            type="button"
            className={`px-3 py-1 rounded-full ${
              category === PostCategory.IDEA
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200'
            }`}
            onClick={() => setCategory(PostCategory.IDEA)}
          >
            {PostCategory.IDEA}
          </button>

          {/* 기본값인 '문장'은 버튼으로 표시하지 않음 */}

          <button
            type="button"
            className={`px-3 py-1 rounded-full ${
              category === PostCategory.QUOTE
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200'
            }`}
            onClick={() => setCategory(PostCategory.QUOTE)}
          >
            {PostCategory.QUOTE}
          </button>

          <button
            type="button"
            className={`px-3 py-1 rounded-full ${
              category === PostCategory.VIDEO
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200'
            }`}
            onClick={() => setCategory(PostCategory.VIDEO)}
          >
            {PostCategory.VIDEO}
          </button>
        </div>
      </div>

      <div>
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-700"
        >
          내용
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={5}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          게시하기
        </button>
        <Link
          href="/"
          className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          취소
        </Link>
      </div>
    </form>
  );
};

export default PostForm;
