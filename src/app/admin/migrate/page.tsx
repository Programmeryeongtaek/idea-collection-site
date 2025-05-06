'use client';

import Toast from '@/components/Toast';
import { migrateLocalStorageToSupabase } from '@/utils/migration';
import Link from 'next/link';
import { useState } from 'react';

export default function MigratePage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [showToast, setShowToast] = useState(false);

  const handleMigration = async () => {
    if (
      !confirm('로컬 스토리지의 데이터를 Supabase로 마이그레이션하시겠습니까?')
    ) {
      return;
    }

    setLoading(true);

    try {
      const migrationResult = await migrateLocalStorageToSupabase();
      setResult(migrationResult);

      if (migrationResult.success) {
        // 성공 시 로컬 스토리지 데이터 유지 여부 확인
        if (
          confirm(
            '마이그레이션이 완료되었습니다. 로컬 스토리지의 데이터를 삭제하시겠습니까?'
          )
        ) {
          localStorage.removeItem('posts');
        }
      }
    } catch (error) {
      console.error('마이그레이션 오류:', error);
      setResult({
        success: false,
        message: '마이그레이션 처리 중 오류가 발생했습니다.',
      });
    } finally {
      setLoading(false);
      setShowToast(true);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-6">데이터 마이그레이션</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <p className="mb-4">
          로컬 스토리지에 저장된 게시글 데이터를 Supabase 데이터베이스로
          이전합니다. 이 작업은 되돌릴 수 없으니 주의해주세요.
        </p>

        <div className="flex gap-4 mt-6">
          <button
            onClick={handleMigration}
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-300"
          >
            {loading ? '마이그레이션 중...' : '마이그레이션 시작'}
          </button>

          <Link
            href="/"
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            취소
          </Link>
        </div>

        {result && (
          <div
            className={`mt-6 p-4 rounded-md ${
              result.success
                ? 'bg-green-50 text-green-800'
                : 'bg-red-50 text-red-800'
            }`}
          >
            <p>{result.message}</p>
          </div>
        )}
      </div>

      {/* 토스트 메시지 */}
      {result && (
        <Toast
          message={result.message}
          type={result.success ? 'success' : 'error'}
          isVisible={showToast}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}
