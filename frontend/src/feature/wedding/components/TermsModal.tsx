'use client';

import { useEffect } from 'react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TermsModal({ isOpen, onClose }: TermsModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg w-full max-w-lg max-h-[85vh] flex flex-col shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <div className="relative flex items-center justify-center px-6 py-4 border-b border-gray-200">
          <div className="text-center">
            <h2 className="text-lg font-bold text-gray-900 en tracking-widest">Terms of Use</h2>
            <p className="text-xs text-gray-500 ja mt-0.5">利用規約</p>
          </div>
          <button
            onClick={onClose}
            className="absolute right-6 text-gray-400 hover:text-gray-700 transition-colors text-2xl leading-none cursor-pointer"
            aria-label="閉じる"
          >
            ×
          </button>
        </div>

        {/* 本文 */}
        <div className="overflow-y-auto px-6 py-5 space-y-6 text-sm text-gray-700 ja leading-relaxed">

          <section>
            <p className="text-sm font-semibold text-gray-900 mb-2">第1条（目的）</p>
            <p>
              本ウェブサイト（以下「本サイト」）は、片岡陽介・湯浅美咲の結婚式にご招待した方への情報提供および出欠確認を目的として運営しております。
              招待を受けたご本人のみご利用いただけます。
            </p>
          </section>

          <section>
            <p className="text-sm font-semibold text-gray-900 mb-2">第2条（禁止事項）</p>
            <ul className="list-disc list-inside space-y-1">
              <li>本サイトのURL・内容を招待者以外の第三者へ共有すること</li>
              <li>掲載されている写真・文章を無断で転載・複製すること</li>
              <li>虚偽の情報を入力して出欠フォームを送信すること</li>
            </ul>
          </section>

          <section>
            <p className="text-sm font-semibold text-gray-900 mb-2">第3条（個人情報の取り扱い）</p>
            <p>
              フォームよりご入力いただいた氏名・住所・メールアドレス・電話番号・アレルギー情報等の個人情報は、出欠管理・席次作成・当日のご連絡のみを目的として使用いたします。
              第三者への提供および目的外利用は一切行いません。
            </p>
          </section>

          <section>
            <p className="text-sm font-semibold text-gray-900 mb-2">第4条（アレルギー対応について）</p>
            <p className="mb-2">
              会場でご用意できるアレルギー対応は、下記の主要品目に限ります。
            </p>
            <p className="font-medium text-gray-800 mb-1">対応可能な品目</p>
            <p className="text-gray-600 mb-3">
              小麦・卵・乳・えび・かに・くるみ・そば・落花生
            </p>
            <p className="text-amber-800 bg-amber-50 rounded px-3 py-2 text-xs">
              ※ 上記以外の特殊なアレルギー・宗教上の食事制限・ビーガン対応等については、
              会場の設備上ご対応が難しい場合がございます。
              ご不安な場合は事前にお問い合わせください。
            </p>
          </section>

          <section>
            <p className="text-sm font-semibold text-gray-900 mb-2">第5条（免責事項）</p>
            <p>
              本サイトは結婚式の準備・運営のために作成した非商業目的のサイトです。
              サイトの内容は予告なく変更される場合があります。
            </p>
          </section>

          <section>
            <p className="text-sm font-semibold text-gray-900 mb-2">お問い合わせ</p>
            <p className="mb-1">本サイトに関するご質問・ご不明点は下記までご連絡ください。</p>
            <ul className="space-y-1">
              <li>
                メール：
                <a href="mailto:soul.vlank@gmail.com" className="text-amber-700 hover:underline">
                  soul.vlank@gmail.com
                </a>
              </li>
              <li>
                電話：
                <a href="tel:08050520075" className="text-amber-700 hover:underline">
                  080-5052-0075
                </a>
              </li>
            </ul>
          </section>

          <p className="text-xs text-gray-400 text-right">制定日：2026年3月3日</p>
        </div>

        {/* フッター */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 text-white text-sm rounded-lg hover:opacity-90 transition-colors ja cursor-pointer"
            style={{backgroundColor: 'rgb(197, 156, 57)'}}
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}
