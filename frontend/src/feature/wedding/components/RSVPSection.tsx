'use client';

import { useState } from 'react';
import { RSVPFormData } from '../types';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { GuestInputForm } from './GuestInputForm';

interface RSVPSectionProps {
  deadline: string;
  onSubmit?: (data: RSVPFormData) => void;
}

export function RSVPSection({ deadline, onSubmit }: RSVPSectionProps) {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation(0.2);
  const { ref: formRef, isVisible: formVisible } = useScrollAnimation(0.2);

  const [formData, setFormData] = useState<RSVPFormData>({
    status: 'attending',
    guestCategory: 'groom',
    japaneseFirstName: '',
    japaneseLastName: '',
    romanFirstName: '',
    romanLastName: '',
    email: '',
    dietaryRestrictions: 'without',
  });

  // お連れ様リスト
  const [guests, setGuests] = useState<Array<RSVPFormData>>([]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showAllergy, setShowAllergy] = useState(false);
  const [agreed, setAgreed] = useState(true);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.japaneseLastName.trim()) newErrors.japaneseLastName = '姓を入力してください';
    if (!formData.japaneseFirstName.trim()) newErrors.japaneseFirstName = '名を入力してください';
    if (!formData.romanLastName.trim()) newErrors.romanLastName = 'Last name is required';
    if (!formData.romanFirstName.trim()) newErrors.romanFirstName = 'First name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Valid email is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, idx?: number
  ) => {
    const { name, value } = e.target;
    if (typeof idx === 'number') {
      setGuests(prev => {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], [name]: value };
        return updated;
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (errors[name]) {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    }
  };

  const handleRadioChange = (name: string, value: string, idx?: number) => {
    if (typeof idx === 'number') {
      setGuests(prev => {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], [name]: value };
        return updated;
      });
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAllergyToggle = (value: string, idx?: number) => {
    if (typeof idx === 'number') {
      handleRadioChange('dietaryRestrictions', value, idx);
      // showAllergyはメインゲストのみ対応
    } else {
      handleRadioChange('dietaryRestrictions', value);
      setShowAllergy(value === 'with');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <section id="rsvp" className="bg-white py-24">
      <div className="max-w-2xl mx-auto px-4">
        {/* Title & Description */}
        <div
          ref={titleRef}
          className={`flex flex-col items-center text-center mb-20 transition-all duration-1000 ${titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <h2 className="mb-2">
            <span className="block font-serif font-extrabold text-black text-5xl md:text-6xl tracking-wide en" style={{letterSpacing: '0.08em'}}>R.S.V.P.</span>
            <span className="block text-black text-lg mt-1 ja">ご出欠</span>
          </h2>
          <div className="mt-8 text-gray-700 text-base leading-relaxed">
            <p className="mb-2">お手数ではございますが<br className="hidden md:inline"/>ご出欠情報のご登録をお願い申し上げます</p>
            <p className="mt-2 text-[#b13a1a] text-lg font-semibold tracking-wide limit">{deadline}までにご一報をお願いいたします</p>
          </div>
        </div>

        {/* Form */}
        <div
          ref={formRef}
          className={`transition-all duration-1000 delay-300 ${formVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Attendance Status - Custom UI */}
            <div className="flex flex-col items-center">
              <div className="flex flex-row gap-24 justify-center">
                {[
                  {
                    value: "attending",
                    en: "ATTEND",
                    ja: "出席",
                  },
                  {
                    value: "not-attending",
                    en: "ABSENT",
                    ja: "欠席",
                  },
                ].map((option) => {
                  const checked = formData.status === option.value;
                  return (
                    <label
                      key={option.value}
                      className="flex flex-col items-center cursor-pointer select-none w-44"
                    >
                      <span className="mb-2 flex items-center justify-center h-10">
                        <input
                          type="radio"
                          name="status"
                          value={option.value}
                          checked={checked}
                          onChange={(e) => handleRadioChange("status", e.target.value)}
                          className="sr-only"
                        />
                        {/* チェックマーク or 空白 */}
                        {checked ? (
                          <svg width="48" height="36" viewBox="0 0 48 36">
                            <polyline
                              points="4,22 18,34 44,4"
                              fill="none"
                              stroke="#b13a1a"
                              strokeWidth="4"
                            />
                          </svg>
                        ) : (
                          <span className="block w-12 h-12" />
                        )}
                      </span>
                      <span
                        className={`en font-serif text-3xl font-extrabold tracking-widest ${checked ? "text-[#b13a1a]" : "text-black"}`}
                        style={{letterSpacing: '0.12em'}}
                      >
                        {option.en}
                      </span>
                      <span
                        className={`ja text-xl mt-1 ${checked ? "text-[#b13a1a]" : "text-black"}`}
                      >
                        {option.ja}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Name Fields */}
            <div className="bg-white rounded-lg p-6">
              <label className="block text-sm font-semibold text-gray-800 mb-4 ja" style={{fontFamily: 'var(--font-noto-sans-jp)'}}>
                <span className="text-red-500">*</span> お名前
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    name="japaneseLastName"
                    placeholder="姓"
                    value={formData.japaneseLastName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black ${
                      errors.japaneseLastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.japaneseLastName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.japaneseLastName}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    name="japaneseFirstName"
                    placeholder="名"
                    value={formData.japaneseFirstName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black ${
                      errors.japaneseFirstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.japaneseFirstName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.japaneseFirstName}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Roman Name */}
            <div className="bg-white rounded-lg p-6">
              <label className="block text-sm font-semibold text-gray-800 mb-4 ja" style={{fontFamily: 'var(--font-noto-sans-jp)'}}>
                <span className="text-red-500">*</span> ローマ字名
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    name="romanLastName"
                    placeholder="Last name"
                    value={formData.romanLastName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black ${
                      errors.romanLastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.romanLastName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.romanLastName}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    name="romanFirstName"
                    placeholder="First name"
                    value={formData.romanFirstName}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black ${
                      errors.romanFirstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.romanFirstName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.romanFirstName}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="bg-white rounded-lg p-6">
              <label className="block text-sm font-semibold text-gray-800 mb-4 ja" style={{fontFamily: 'var(--font-noto-sans-jp)'}}>
                <span className="text-red-500">*</span> メールアドレス
              </label>
              <input
                type="email"
                name="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* 郵便番号・住所・建物名・電話番号 */}
            <div className="bg-white rounded-lg p-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-4 ja">
                    郵便番号
                  </label>
                  <input
                    type="text"
                    name="zipcode"
                    placeholder="1234567"
                    value={formData.zipcode || ''}
                    onChange={e => handleInputChange(e)}
                    maxLength={7}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black border-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-4 ja">
                    住所
                  </label>
                  <input
                    type="text"
                    name="address"
                    placeholder="東京都港区..."
                    value={formData.address || ''}
                    onChange={e => handleInputChange(e)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black border-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-4 ja">
                    建物名
                  </label>
                  <input
                    type="text"
                    name="building"
                    placeholder="ビル名など"
                    value={formData.building || ''}
                    onChange={e => handleInputChange(e)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black border-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-4 ja">
                    電話番号
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="09012345678"
                    value={formData.phone || ''}
                    onChange={e => handleInputChange(e)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black border-gray-300"
                  />
                </div>
              </div>
            </div>

            {/* Guest Category - Black Square Radio */}
            <div className="bg-white rounded-lg p-6">
              <label className="block text-sm font-semibold text-gray-800 mb-4 ja">
                <span className="text-red-500">*</span> ゲストカテゴリー
              </label>
              <div className="flex gap-8">
                {[{ value: 'groom', label: '新郎側ゲスト' }, { value: 'bride', label: '新婦側ゲスト' }].map(option => {
                  const checked = formData.guestCategory === option.value;
                  return (
                    <label key={option.value} className="flex items-center cursor-pointer gap-2">
                      <input
                        type="radio"
                        name="guestCategory"
                        value={option.value}
                        checked={checked}
                        onChange={e => handleRadioChange('guestCategory', e.target.value)}
                        className="sr-only"
                      />
                      <span
                        className={`w-8 h-8 border-2 rounded-sm flex items-center justify-center transition-colors duration-150 ${checked ? 'bg-black border-black' : 'bg-white border-black'}`}
                      >
                        {/* 黒塗りつぶし: checked時のみ黒、未選択は白 */}
                      </span>
                      <span className="text-black text-base">{option.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* 年齢区分 */}
            <div className="bg-white rounded-lg p-6">
              <label className="block text-sm font-semibold text-gray-800 mb-4 ja">
                年齢区分
              </label>
              <div className="flex gap-8">
                {[
                  { value: 'adult', label: '大人' },
                  { value: 'child', label: '子ども' },
                  { value: 'infant', label: '幼児' },
                ].map(option => {
                  const checked = formData.ageCategory === option.value;
                  return (
                    <label key={option.value} className="flex items-center cursor-pointer gap-2">
                      <input
                        type="radio"
                        name="ageCategory"
                        value={option.value}
                        checked={checked}
                        onChange={e => handleRadioChange('ageCategory', e.target.value)}
                        className="sr-only"
                      />
                      <span
                        className={`w-8 h-8 border-2 rounded-sm flex items-center justify-center transition-colors duration-150 ${checked ? 'bg-black border-black' : 'bg-white border-black'}`}
                      >
                        {/* 黒塗りつぶし: checked時のみ黒、未選択は白 */}
                      </span>
                      <span className="text-black text-base ja">{option.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Dietary Restrictions - Black Square Radio */}
            <div className="bg-white rounded-lg p-6">
              <label className="block text-sm font-semibold text-gray-800 mb-4 ja">
                <span className="text-red-500">*</span> アレルギー情報
                <span className="block text-xs text-gray-600 font-normal mt-1 ja">食物アレルギーに関する情報でございます</span>
              </label>
              <div className="flex gap-8">
                {[{ value: 'with', label: '有り' }, { value: 'without', label: '無し' }].map(option => {
                  const checked = formData.dietaryRestrictions === option.value;
                  return (
                    <label key={option.value} className="flex items-center cursor-pointer gap-2">
                      <input
                        type="radio"
                        name="dietaryRestrictions"
                        value={option.value}
                        checked={checked}
                        onChange={() => handleAllergyToggle(option.value)}
                        className="sr-only"
                      />
                      <span
                        className={`w-8 h-8 border-2 rounded-sm flex items-center justify-center transition-colors duration-150 ${checked ? 'bg-black border-black' : 'bg-white border-black'}`}
                      >
                        {/* 黒塗りつぶし: checked時のみ黒、未選択は白 */}
                      </span>
                      <span className="text-black text-base">{option.label}</span>
                    </label>
                  );
                })}
              </div>

              {showAllergy && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <input
                    type="text"
                    name="allergyInfo"
                    placeholder="例：えび、かに、くるみ等"
                    value={formData.allergyInfo || ''}
                    onChange={handleInputChange}
                    maxLength={15}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black"
                  />
                </div>
              )}
            </div>

            {/* Message */}
            <div className="bg-white rounded-lg p-6">
              <label className="block text-sm font-semibold text-gray-800 mb-3 ja" style={{fontFamily: 'var(--font-noto-sans-jp)'}}>
                メッセージ
              </label>
              <textarea
                name="message"
                placeholder="お祝いのお言葉をお聞かせください"
                value={formData.message || ''}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black resize-none"
              />
            </div>

            {/* お連れ様入力欄 */}
            {guests.map((guest, idx) => (
              <GuestInputForm
                key={idx}
                guest={guest}
                index={idx}
                onInputChange={handleInputChange}
                onRadioChange={handleRadioChange}
                onAllergyToggle={handleAllergyToggle}
                onRemove={(i) => setGuests(prev => prev.filter((_, index) => index !== i))}
              />
            ))}

            {/* お連れ様追加ボタン */}
            <div className="flex items-center justify-center gap-8">
              <button
                type="button"
                className="flex items-center gap-4 px-6 py-3 bg-white border-none text-black text-2xl font-normal focus:outline-none"
                onClick={() => setGuests(prev => [...prev, {
                  status: 'attending',
                  guestCategory: 'groom',
                  japaneseFirstName: '',
                  japaneseLastName: '',
                  romanFirstName: '',
                  romanLastName: '',
                  email: '',
                  dietaryRestrictions: 'without',
                }])}
              >
                <span className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-800 text-white text-3xl font-bold">＋</span>
                <span className="text-black text-2xl ja">お連れ様の追加</span>
                <span className="text-black text-2xl en">Add a guest</span>
              </button>
            </div>

            {/* Terms Agreement */}
            <div className="bg-white rounded-lg p-6">
              <label className="flex items-start">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="w-4 h-4 mt-1 text-amber-700"
                />
                <span className="ml-3 text-sm text-gray-700 ja" style={{fontFamily: 'var(--font-noto-sans-jp)'}}>
                  <a
                    href="#terms"
                    className="text-amber-700 hover:underline"
                  >
                    利用規約
                  </a>
                  をお読みの上、同意されます
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                disabled={!agreed}
                className="px-8 py-3 bg-amber-900 text-white rounded-lg hover:bg-amber-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-semibold ja"
                style={{backgroundColor: 'rgb(118, 122, 37)'}}
              >
                送信
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
