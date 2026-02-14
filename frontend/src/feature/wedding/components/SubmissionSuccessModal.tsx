'use client';

import { useEffect, useState } from 'react';

interface SubmissionSuccessModalProps {
  isOpen: boolean;
  guestName: string;
  onClose?: () => void;
}

export function SubmissionSuccessModal({
  isOpen,
  guestName,
  onClose,
}: SubmissionSuccessModalProps) {
  const [display, setDisplay] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setDisplay(true);
    }
  }, [isOpen]);

  if (!display) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8 text-center animate-fadeIn">
        <div className="mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <svg
              className="w-8 h-8 text-green-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        <h2 className="text-2xl font-light mb-4 text-amber-900" style={{ fontFamily: 'var(--font-noto-sans-jp)' }}>
          ご登録ありがとうございました
        </h2>

        <p className="text-gray-700 mb-2" style={{ fontFamily: 'var(--font-noto-sans-jp)' }}>
          <span className="font-semibold">{guestName}</span>様へ
        </p>

        <p className="text-gray-600 text-sm mb-8" style={{ fontFamily: 'var(--font-noto-sans-jp)' }}>
          ご出欠のご登録をいただきました。
          <br />
          ご登録内容の確認メールをお送りします。
          <br />
          ご確認よろしくお願いします。
        </p>

        <button
          onClick={onClose}
          className="w-full px-4 py-3 bg-amber-900 text-white rounded-lg hover:bg-amber-800 transition-colors font-semibold"
          style={{ fontFamily: 'var(--font-noto-sans-jp)' }}
        >
          閉じる
        </button>
      </div>
    </div>
  );
}