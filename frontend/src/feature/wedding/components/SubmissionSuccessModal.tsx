'use client';

interface SubmissionSuccessModalProps {
  isOpen: boolean;
  guestName?: string;
  onClose?: () => void;
}

export function SubmissionSuccessModal({
  isOpen,
  guestName: _guestName,
  onClose,
}: SubmissionSuccessModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8 text-center">
        <p className="text-gray-700 mb-2 ja">
          ご出欠のご登録をいただきました。
        </p>
        <p className="text-gray-500 text-sm mb-8 en">
          Thank you! We can&apos;t wait to see you!
        </p>

        <button
          onClick={onClose}
          className="w-full px-4 py-3 text-white rounded-lg hover:opacity-90 transition-colors font-semibold ja cursor-pointer"
          style={{backgroundColor: 'rgb(197, 156, 57)'}}
        >
          閉じる
        </button>
      </div>
    </div>
  );
}