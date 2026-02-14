'use client';

import { RSVPFormData } from '../types';

interface GuestInputFormProps {
  guest: RSVPFormData;
  index: number;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, idx: number) => void;
  onRadioChange: (name: string, value: string, idx: number) => void;
  onAllergyToggle: (value: string, idx: number) => void;
  onRemove: (idx: number) => void;
}

export function GuestInputForm({
  guest,
  index,
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
          お名前
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              name="japaneseLastName"
              placeholder="姓"
              value={guest.japaneseLastName}
              onChange={e => onInputChange(e, index)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black border-gray-300"
            />
          </div>
          <div>
            <input
              type="text"
              name="japaneseFirstName"
              placeholder="名"
              value={guest.japaneseFirstName}
              onChange={e => onInputChange(e, index)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black border-gray-300"
            />
          </div>
        </div>
      </div>

      {/* かな */}
      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-4 ja">
          かな
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              name="kanaLastName"
              placeholder="せい"
              value={guest.kanaLastName || ''}
              onChange={e => onInputChange(e, index)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black border-gray-300"
            />
          </div>
          <div>
            <input
              type="text"
              name="kanaFirstName"
              placeholder="めい"
              value={guest.kanaFirstName || ''}
              onChange={e => onInputChange(e, index)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black border-gray-300"
            />
          </div>
        </div>
      </div>

      {/* ローマ字 */}
      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-4 ja">
          ローマ字
        </label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              name="romanLastName"
              placeholder="姓 last name"
              value={guest.romanLastName}
              onChange={e => onInputChange(e, index)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black border-gray-300"
            />
          </div>
          <div>
            <input
              type="text"
              name="romanFirstName"
              placeholder="名 first name"
              value={guest.romanFirstName}
              onChange={e => onInputChange(e, index)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black border-gray-300"
            />
          </div>
        </div>
      </div>

      {/* 年齢区分 */}
      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-2 ja">
          年齢区分
        </label>
        <div className="flex gap-8">
          {[
            { value: 'adult', label: '大人' },
            { value: 'child', label: '子ども' },
            { value: 'infant', label: '幼児' },
          ].map(option => {
            const checked = guest.ageCategory === option.value;
            return (
              <label key={option.value} className="flex items-center cursor-pointer gap-2">
                <input
                  type="radio"
                  name={`ageCategory-${index}`}
                  value={option.value}
                  checked={checked}
                  onChange={e => onRadioChange('ageCategory', e.target.value, index)}
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

      {/* アレルギー情報 */}
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
      <div>
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
