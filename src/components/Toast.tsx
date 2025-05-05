'use client';

import { useEffect, useState } from 'react';

interface ToastProps {
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  isVisible: boolean;
  onClose: () => void;
  autoClose?: boolean;
  autoCloseTime?: number;
}

export default function Toast({
  message,
  type = 'info',
  isVisible,
  onClose,
  autoClose = true,
  autoCloseTime = 3000,
}: ToastProps) {
  const [isClosing, setIsClosing] = useState(false);

  // 타입에 따른 색상 설정
  const bgColor = {
    info: 'bg-blue-500',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-red-500',
  };

  // 자동 닫기
  useEffect(() => {
    if (isVisible && autoClose) {
      const timer = setTimeout(() => {
        setIsClosing(true);
        setTimeout(() => {
          onClose();
          setIsClosing(false);
        }, 300); // 페이드 아웃 애니메이션
      }, autoCloseTime);

      return () => clearTimeout(timer);
    }
  }, [isVisible, autoClose, autoCloseTime, onClose]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 p-4 rounded-md shadow-lg text-white max-w-xs
                ${bgColor[type]} 
                ${isClosing ? 'animate-fade-out' : 'animate-fade-in'}`}
      role="alert"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">{message}</div>
        <button
          onClick={() => {
            setIsClosing(true);
            setTimeout(() => {
              onClose();
              setIsClosing(false);
            }, 300);
          }}
          className="ml-4 text-white"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
