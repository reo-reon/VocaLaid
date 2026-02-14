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

  const statusLabel =
    data.status === 'attending' ? '出席' : '欠席';
  const categoryLabel =
    data.guestCategory === 'groom' ? '新郎側ゲスト' : '新婦側ゲスト';
  const ageLabel =
    data.ageCategory === 'adult'
      ? '大人'
      : data.ageCategory === 'child'
        ? '子供'
        : '幼児';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8 animate-fadeIn">
        <h2 className="text-2xl font-light mb-6 text-center text-amber-900" style={{ fontFamily: 'var(--font-noto-sans-jp)' }}>
          ご登録内容の確認
        </h2>

        <div className="space-y-4 mb-8 text-sm" style={{ fontFamily: 'var(--font-noto-sans-jp)' }}>
          <div className="border-b border-gray-200 pb-3">
            <p className="text-gray-600 text-xs mb-1">ご出欠</p>
            <p className="font-semibold text-gray-800">{statusLabel}</p>
          </div>

          <div className="border-b border-gray-200 pb-3">
            <p className="text-gray-600 text-xs mb-1">ゲストカテゴリー</p>
            <p className="font-semibold text-gray-800">{categoryLabel}</p>
          </div>

          <div className="border-b border-gray-200 pb-3">
            <p className="text-gray-600 text-xs mb-1">お名前</p>
            <p className="font-semibold text-gray-800">
              {data.japaneseLastName} {data.japaneseFirstName}
            </p>
            <p className="text-xs text-gray-600 mt-1">
              {data.romanLastName} {data.romanFirstName}
            </p>
          </div>

          <div className="border-b border-gray-200 pb-3">
            <p className="text-gray-600 text-xs mb-1">メールアドレス</p>
            <p className="font-semibold text-gray-800 break-all">{data.email}</p>
          </div>

          {data.ageCategory && (
            <div className="border-b border-gray-200 pb-3">
              <p className="text-gray-600 text-xs mb-1">年齢区分</p>
              <p className="font-semibold text-gray-800">{ageLabel}</p>
            </div>
          )}

          {data.phone && (
            <div className="border-b border-gray-200 pb-3">
              <p className="text-gray-600 text-xs mb-1">電話番号</p>
              <p className="font-semibold text-gray-800">{data.phone}</p>
            </div>
          )}

          <div className="border-b border-gray-200 pb-3">
            <p className="text-gray-600 text-xs mb-1">食事制限</p>
            <p className="font-semibold text-gray-800">
              {data.dietaryRestrictions === 'with' ? '有り' : '無し'}
            </p>
            {data.allergyInfo && (
              <p className="text-xs text-gray-600 mt-1">{data.allergyInfo}</p>
            )}
          </div>

          {data.message && (
            <div className="pb-3">
              <p className="text-gray-600 text-xs mb-1">メッセージ</p>
              <p className="font-semibold text-gray-800 whitespace-pre-wrap">
                {data.message}
              </p>
            </div>
          )}
        </div>

        <div className="bg-amber-50 rounded-lg p-4 mb-8 border border-amber-200" style={{ fontFamily: 'var(--font-noto-sans-jp)' }}>
          <p className="text-xs text-gray-700">
            上記内容で登録させていただきます。
            <br />
            よろしければ、「送信」ボタンをクリックしてください。
          </p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-800 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
            style={{ fontFamily: 'var(--font-noto-sans-jp)' }}
          >
            修正
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-amber-900 text-white rounded-lg hover:bg-amber-800 transition-colors font-semibold"
            style={{ fontFamily: 'var(--font-noto-sans-jp)' }}
          >
            送信
          </button>
        </div>
      </div>
    </div>
  );
}