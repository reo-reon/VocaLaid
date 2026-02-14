'use client';

import { useState } from 'react';
import { RSVPFormData } from '../types';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

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

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showAllergy, setShowAllergy] = useState(false);
  const [agreed, setAgreed] = useState(true);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.japaneseLastName.trim())
      newErrors.japaneseLastName = '姓を入力してください';
    if (!formData.japaneseFirstName.trim())
      newErrors.japaneseFirstName = '名を入力してください';
    if (!formData.romanLastName.trim())
      newErrors.romanLastName = 'Last name is required';
    if (!formData.romanFirstName.trim())
      newErrors.romanFirstName = 'First name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = 'Valid email is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleRadioChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAllergyToggle = (value: string) => {
    handleRadioChange('dietaryRestrictions', value);
    setShowAllergy(value === 'with');
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
    <section id="rsvp" className="py-16 md:py-24 bg-amber-50">
      <div className="container mx-auto px-4">
        {/* Title */}
        <div
          ref={titleRef}
          className={`text-center mb-12 transition-all duration-1000 ${
            titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-light mb-4" style={{fontFamily: 'var(--font-playfair)'}}>
            <span className="text-xs text-gray-600 block mb-2 en" style={{fontFamily: 'var(--font-playfair)', letterSpacing: '0.05em'}}>R.S.V.P.</span>
            <span className="text-amber-900 ja" style={{fontFamily: 'var(--font-noto-sans-jp)'}}>ご出欠</span>
          </h2>
          <p className="text-gray-700 mt-4 ja" style={{fontFamily: 'var(--font-noto-sans-jp)'}}>
            お手数ですが、{deadline}までにご一報をお願いいたします
          </p>
        </div>

        {/* Form */}
        <div
          ref={formRef}
          className={`max-w-2xl mx-auto transition-all duration-1000 delay-300 ${
            formVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Attendance Status */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <label className="block text-sm font-semibold text-gray-800 mb-4 ja" style={{fontFamily: 'var(--font-noto-sans-jp)'}}>
                <span className="text-red-500">*</span> ご出欠
              </label>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    value="attending"
                    checked={formData.status === 'attending'}
                    onChange={(e) =>
                      handleRadioChange('status', e.target.value)
                    }
                    className="w-4 h-4 text-amber-700"
                  />
                  <span className="ml-3 text-gray-700 ja" style={{fontFamily: 'var(--font-noto-sans-jp)'}}>出席</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="status"
                    value="not-attending"
                    checked={formData.status === 'not-attending'}
                    onChange={(e) =>
                      handleRadioChange('status', e.target.value)
                    }
                    className="w-4 h-4 text-amber-700"
                  />
                  <span className="ml-3 text-gray-700 ja" style={{fontFamily: 'var(--font-noto-sans-jp)'}}>欠席</span>
                </label>
              </div>
            </div>

            {/* Guest Category */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <label className="block text-sm font-semibold text-gray-800 mb-4 ja" style={{fontFamily: 'var(--font-noto-sans-jp)'}}>
                <span className="text-red-500">*</span> ゲストカテゴリー
              </label>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="guestCategory"
                    value="groom"
                    checked={formData.guestCategory === 'groom'}
                    onChange={(e) =>
                      handleRadioChange('guestCategory', e.target.value)
                    }
                    className="w-4 h-4 text-amber-700"
                  />
                  <span className="ml-3 text-gray-700">新郎側ゲスト(Groom)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="guestCategory"
                    value="bride"
                    checked={formData.guestCategory === 'bride'}
                    onChange={(e) =>
                      handleRadioChange('guestCategory', e.target.value)
                    }
                    className="w-4 h-4 text-amber-700"
                  />
                  <span className="ml-3 text-gray-700">新婦側ゲスト(Bride)</span>
                </label>
              </div>
            </div>

            {/* Name Fields */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
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
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700 ${
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
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700 ${
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
            <div className="bg-white rounded-lg p-6 shadow-sm">
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
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700 ${
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
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700 ${
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
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <label className="block text-sm font-semibold text-gray-800 mb-4 ja" style={{fontFamily: 'var(--font-noto-sans-jp)'}}>
                <span className="text-red-500">*</span> メールアドレス
              </label>
              <input
                type="email"
                name="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700 ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Optional Fields */}
            <div className="bg-white rounded-lg p-6 shadow-sm space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  年齢区分
                </label>
                <div className="space-y-2">
                  {['adult', 'child', 'infant'].map((val) => (
                    <label key={val} className="flex items-center">
                      <input
                        type="radio"
                        name="ageCategory"
                        value={val}
                        checked={formData.ageCategory === val}
                        onChange={(e) =>
                          handleRadioChange('ageCategory', e.target.value)
                        }
                        className="w-4 h-4 text-amber-700"
                      />
                      <span className="ml-3 text-gray-700">
                        {val === 'adult'
                          ? '大人 (Adult)'
                          : val === 'child'
                            ? '子ども(Child)'
                            : '幼児(Infant)'}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  郵便番号
                </label>
                <input
                  type="text"
                  name="zipcode"
                  placeholder="1234567"
                  value={formData.zipcode || ''}
                  onChange={handleInputChange}
                  maxLength={7}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  住所
                </label>
                <input
                  type="text"
                  name="address"
                  placeholder="東京都港区..."
                  value={formData.address || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  建物名
                </label>
                <input
                  type="text"
                  name="building"
                  placeholder="ビル名など"
                  value={formData.building || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  電話番号
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="09012345678"
                  value={formData.phone || ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700"
                />
              </div>
            </div>

            {/* Dietary Restrictions */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <label className="block text-sm font-semibold text-gray-800 mb-4 ja" style={{fontFamily: 'var(--font-noto-sans-jp)'}}>
                <span className="text-red-500">*</span> 食事制限
                <span className="block text-xs text-gray-600 font-normal mt-1 ja">食物アレルギーに関する情報でございます</span>
              </label>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="dietaryRestrictions"
                    value="with"
                    checked={formData.dietaryRestrictions === 'with'}
                    onChange={() => handleAllergyToggle('with')}
                    className="w-4 h-4 text-amber-700"
                  />
                  <span className="ml-3 text-gray-700">有り (With)</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="dietaryRestrictions"
                    value="without"
                    checked={formData.dietaryRestrictions === 'without'}
                    onChange={() => handleAllergyToggle('without')}
                    className="w-4 h-4 text-amber-700"
                  />
                  <span className="ml-3 text-gray-700">無し(Without)</span>
                </label>
              </div>

              {showAllergy && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    アレルギー情報（5文字以内）
                  </label>
                  <input
                    type="text"
                    name="allergyInfo"
                    placeholder="例：えび、かに、くるみ等"
                    value={formData.allergyInfo || ''}
                    onChange={handleInputChange}
                    maxLength={15}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700"
                  />
                </div>
              )}
            </div>

            {/* Message */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <label className="block text-sm font-semibold text-gray-800 mb-3 ja" style={{fontFamily: 'var(--font-noto-sans-jp)'}}>
                メッセージ
              </label>
              <textarea
                name="message"
                placeholder="お祝いのお言葉をお聞かせください"
                value={formData.message || ''}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700 resize-none"
              />
            </div>

            {/* Terms Agreement */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
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
                className="px-8 py-3 bg-amber-900 text-white rounded-lg hover:bg-amber-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-semibold"
              >
                送信
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
