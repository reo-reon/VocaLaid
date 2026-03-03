'use client';

import { RSVPFormData } from '../types';

interface GuestInputFormProps {
  guest: RSVPFormData;
  index: number;
  errors?: Record<string, string>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, idx: number) => void;
  onRadioChange: (name: string, value: string, idx: number) => void;
  onAllergyToggle: (value: string, idx: number) => void;
  onRemove: (idx: number) => void;
}

export function GuestInputForm({
  guest,
  index,
  errors = {},
  onInputChange,
  onRadioChange,
  onAllergyToggle,
  onRemove,
}: GuestInputFormProps) {
  return (
    <div className="bg-white rounded-lg p-6 space-y-4 border border-gray-200">
      <div className="mb-2 text-lg font-semibold text-gray-700 ja">〜お連れ様{index + 1}人目〜</div>
      
      {/* お名前 */}
      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-4 ja">
          <span className="text-red-500">*</span> お名前
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              name="japaneseLastName"
              placeholder="姓"
              value={guest.japaneseLastName}
              onChange={e => onInputChange(e, index)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black ${errors.japaneseLastName ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.japaneseLastName && <p className="text-red-500 text-xs mt-1">{errors.japaneseLastName}</p>}
          </div>
          <div>
            <input
              type="text"
              name="japaneseFirstName"
              placeholder="名"
              value={guest.japaneseFirstName}
              onChange={e => onInputChange(e, index)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black ${errors.japaneseFirstName ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.japaneseFirstName && <p className="text-red-500 text-xs mt-1">{errors.japaneseFirstName}</p>}
          </div>
        </div>
      </div>

      {/* かな */}
      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-4 ja">
          <span className="text-red-500">*</span> かな
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              name="kanaLastName"
              placeholder="せい"
              value={guest.kanaLastName || ''}
              onChange={e => onInputChange(e, index)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black ${errors.kanaLastName ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.kanaLastName && <p className="text-red-500 text-xs mt-1">{errors.kanaLastName}</p>}
          </div>
          <div>
            <input
              type="text"
              name="kanaFirstName"
              placeholder="めい"
              value={guest.kanaFirstName || ''}
              onChange={e => onInputChange(e, index)}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black ${errors.kanaFirstName ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.kanaFirstName && <p className="text-red-500 text-xs mt-1">{errors.kanaFirstName}</p>}
          </div>
        </div>
      </div>

      {/* メールアドレス */}
      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-4 ja">
          メールアドレス
        </label>
        <input
          type="email"
          name="email"
          placeholder="your@email.com"
          value={guest.email || ''}
          onChange={e => onInputChange(e, index)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black border-gray-300"
        />
      </div>

      {/* 電話番号（任意） */}
      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-4 ja">
          電話番号
        </label>
        <input
          type="tel"
          name="phone"
          placeholder="090-0000-0000"
          value={guest.phone || ''}
          onChange={e => onInputChange(e, index)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black border-gray-300"
        />
      </div>

      {/* 年齢区分 */}
      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-2 ja">
          <span className="text-red-500">*</span> 年齢区分
        </label>
        <div className="grid grid-cols-2 gap-x-4 gap-y-4">
          {[
            { value: 'adult', label: '大人' },
            { value: 'child', label: '子供（～18歳頃）', sub: '大人と同じ食事' },
            { value: 'infant', label: '幼児（～5歳頃）', sub: 'お子様ランチ' },
            { value: 'baby', label: '新生児（～1歳頃）', sub: '食事不要' },
          ].map(option => {
            const checked = guest.ageCategory === option.value;
            return (
              <label key={option.value} className="flex items-start cursor-pointer gap-2">
                <input
                  type="radio"
                  name={`ageCategory-${index}`}
                  value={option.value}
                  checked={checked}
                  onChange={e => onRadioChange('ageCategory', e.target.value, index)}
                  className="sr-only"
                />
                <span
                  style={{ width: '2rem', height: '2rem', flexShrink: 0 }}
                  className={`border-2 rounded-sm flex items-center justify-center transition-colors duration-150 ${checked ? 'bg-black border-black' : 'bg-white border-black'}`}
                >
                </span>
                <span className="text-black text-sm ja">
                  {option.label}
                  {'sub' in option && option.sub && (
                    <span className="block text-xs text-gray-500 font-normal">※{option.sub}</span>
                  )}
                </span>
              </label>
            );
          })}
        </div>
        {errors.ageCategory && <p className="text-red-500 text-xs mt-2">{errors.ageCategory}</p>}
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-2 ja">
          アレルギー情報
        </label>
        <div className="flex gap-8">
          {[{ value: 'with', label: '有り' }, { value: 'without', label: '無し' }].map(option => {
            const checked = guest.dietaryRestrictions === option.value;
            return (
              <label key={option.value} className="flex items-center cursor-pointer gap-2">
                <input
                  type="radio"
                  name={`dietaryRestrictions-${index}`}
                  value={option.value}
                  checked={checked}
                  onChange={() => onAllergyToggle(option.value, index)}
                  className="sr-only"
                />
                <span
                  className={`w-8 h-8 border-2 rounded-sm flex items-center justify-center transition-colors duration-150 ${checked ? 'bg-black border-black' : 'bg-white border-black'}`}
                >
                </span>
                <span className="text-black text-base ja">{option.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* アレルギー情報入力欄 */}
      {guest.dietaryRestrictions === 'with' && (
        <div className="pt-2 border-t border-gray-200">
          <input
            type="text"
            name="allergyInfo"
            placeholder="例：えび、かに、くるみ等"
            value={guest.allergyInfo || ''}
            onChange={e => onInputChange(e, index)}
            maxLength={15}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
          />
        </div>
      )}

      {/* 二次会 */}
      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-4 ja">
          二次会へのご参加
        </label>
        <label className="flex items-center cursor-pointer gap-2">
          <input
            type="checkbox"
            name="afterParty"
            checked={guest.afterParty || false}
            onChange={(e) => onInputChange(e, index)}
            className="sr-only"
          />
          <span
            className={`w-8 h-8 border-2 rounded-sm flex items-center justify-center transition-colors duration-150 shrink-0 ${guest.afterParty ? 'bg-black border-black' : 'bg-white border-black'}`}
          >
            {/* 黒塗りつぶし: checked時のみ黒、未選択は白 */}
          </span>
          <span className="text-black text-base ja">参加希望</span>
        </label>
      </div>

      {/* 削除ボタン */}
      <div className="flex justify-end mt-4">
        <button
          type="button"
          className="text-gray-700 text-lg flex items-center gap-2 hover:text-red-500 ja"
          onClick={() => onRemove(index)}
        >
          <span className="text-2xl">×</span> 削除する
        </button>
      </div>
    </div>
  );
}
