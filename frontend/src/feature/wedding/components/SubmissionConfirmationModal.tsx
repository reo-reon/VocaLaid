'use client';

import { RSVPFormData } from '../types';

interface SubmissionConfirmationModalProps {
  isOpen: boolean;
  data: RSVPFormData | null;
  onConfirm?: () => void;
  onClose?: () => void;
}

export function SubmissionConfirmationModal({
  isOpen,
  data,
  onConfirm,
  onClose,
}: SubmissionConfirmationModalProps) {
  if (!isOpen || !data) return null;

  const statusLabel = data.status === 'attending' ? '出席' : '欠席';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-8 text-center ja">
        <p className="text-gray-700 mb-2 ja">
          <span className="font-semibold text-2xl">{statusLabel}</span>
          でよろしいですか？
        </p>

        <div className="flex gap-4 mt-8">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-800 rounded-lg hover:bg-gray-50 transition-colors font-semibold ja"
          >
            戻る
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-amber-900 text-white rounded-lg hover:bg-amber-800 transition-colors font-semibold ja"
          >
            送信
          </button>
        </div>
      </div>
    </div>
  );
}