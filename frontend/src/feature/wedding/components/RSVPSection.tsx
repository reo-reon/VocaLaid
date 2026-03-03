'use client';

import { useEffect, useRef, useState } from 'react';
import { RSVPFormData } from '../types';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { GuestInputForm } from './GuestInputForm';
import { SubmissionSuccessModal } from './SubmissionSuccessModal';
import { SubmissionConfirmationModal } from './SubmissionConfirmationModal';
import { rsvpClient } from '@/api/rsvpClient';
import { ApiError } from '@/api/restClient';

/** バックエンドのバリデーションエラーメッセージを日本語に変換 */
const FIELD_LABELS: Record<string, string> = {
  status: '出欠ステータス',
  guestCategory: 'ゲスト区分',
  japaneseLastName: '姓（漢字）',
  japaneseFirstName: '名（漢字）',
  kanaLastName: '姓（かな）',
  kanaFirstName: '名（かな）',
  email: 'メールアドレス',
  zipcode: '郵便番号',
  address: '住所',
  building: '建物名',
  phone: '電話番号',
  ageCategory: '年齢区分',
  dietaryRestrictions: '食事制限',
  allergyInfo: 'アレルギー情報',
  message: 'メッセージ',
};

function translateValidationMessage(msg: string): string {
  // フィールド名を日本語ラベルに置換
  let translated = msg;
  for (const [field, label] of Object.entries(FIELD_LABELS)) {
    if (msg.toLowerCase().startsWith(field.toLowerCase())) {
      if (/must be shorter than or equal to (\d+) characters/.test(msg)) {
        const m = msg.match(/(\d+)/);
        translated = `${label}は${m?.[1]}文字以内で入力してください`;
      } else if (/must be one of the following values/.test(msg)) {
        translated = `${label}の値が不正です`;
      } else if (/should not be empty/.test(msg)) {
        translated = `${label}を入力してください`;
      } else if (/must be an email/.test(msg)) {
        translated = `${label}に正しいメールアドレスを入力してください`;
      } else {
        translated = `${label}の値が不正です`;
      }
      break;
    }
  }
  return translated;
}

interface RSVPSectionProps {
  deadline: string;
  onSubmit?: (data: RSVPFormData) => void;
  onOpenTerms?: () => void;
}

export function RSVPSection({ deadline, onSubmit: _onSubmit, onOpenTerms }: RSVPSectionProps) {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation(0.2);
  const { ref: formRef, isVisible: formVisible } = useScrollAnimation(0.2);

  const [formData, setFormData] = useState<RSVPFormData>({
    status: 'attending',
    guestCategory: 'groom',
    japaneseFirstName: '',
    japaneseLastName: '',
    kanaFirstName: '',
    kanaLastName: '',
    email: '',
    dietaryRestrictions: 'without',
    afterParty: false,
  });

  // お連れ様リスト
  const [guests, setGuests] = useState<Array<RSVPFormData>>([]);

  // アニメーション用: ゲストごとの安定ID管理
  const guestIdCounter = useRef(0);
  const [guestKeys, setGuestKeys] = useState<number[]>([]);
  const guestKeysRef = useRef<number[]>([]);
  const [removingKeys, setRemovingKeys] = useState<Set<number>>(new Set());
  const [enteringKeys, setEnteringKeys] = useState<Set<number>>(new Set());

  useEffect(() => {
    guestKeysRef.current = guestKeys;
  }, [guestKeys]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [guestErrors, setGuestErrors] = useState<Array<Record<string, string>>>([]);
  const [showAllergy, setShowAllergy] = useState(false);
  const [agreed, setAgreed] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (window.location.hostname === 'localhost') return;
    if (localStorage.getItem('rsvp_submitted') === 'true') {
      setSubmitted(true);
    }
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.japaneseLastName.trim()) newErrors.japaneseLastName = '姓を入力してください';
    if (!formData.japaneseFirstName.trim()) newErrors.japaneseFirstName = '名を入力してください';
    if (!formData.kanaLastName.trim()) newErrors.kanaLastName = '姓（かな）を入力してください';
    if (!formData.kanaFirstName.trim()) newErrors.kanaFirstName = '名（かな）を入力してください';
    if (!formData.email?.trim()) newErrors.email = 'Email is required';
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Valid email is required';
    if (!formData.zipcode?.trim()) newErrors.zipcode = '郵便番号を入力してください';
    if (!formData.address?.trim()) newErrors.address = '住所を入力してください';
    if (!formData.phone?.trim()) newErrors.phone = '電話番号を入力してください';
    if (!formData.ageCategory) newErrors.ageCategory = '年齢区分を選択してください';
    setErrors(newErrors);

    const newGuestErrors: Array<Record<string, string>> = guests.map((g) => {
      const ge: Record<string, string> = {};
      if (!g.japaneseLastName.trim()) ge.japaneseLastName = '姓を入力してください';
      if (!g.japaneseFirstName.trim()) ge.japaneseFirstName = '名を入力してください';
      if (!g.kanaLastName?.trim()) ge.kanaLastName = '姓（かな）を入力してください';
      if (!g.kanaFirstName?.trim()) ge.kanaFirstName = '名（かな）を入力してください';
      if (!g.ageCategory) ge.ageCategory = '年齢区分を選択してください';
      return ge;
    });
    setGuestErrors(newGuestErrors);

    return Object.keys(newErrors).length === 0 && newGuestErrors.every(ge => Object.keys(ge).length === 0);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, idx?: number
  ) => {
    const { name, value } = e.target;
    const actualValue = (e.target as HTMLInputElement).type === 'checkbox'
      ? (e.target as HTMLInputElement).checked
      : value;
    if (typeof idx === 'number') {
      setGuests(prev => {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], [name]: actualValue };
        return updated;
      });
      if (guestErrors[idx]?.[name]) {
        setGuestErrors(prev => {
          const updated = [...prev];
          const e = { ...updated[idx] };
          delete e[name];
          updated[idx] = e;
          return updated;
        });
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: actualValue }));
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
      if (guestErrors[idx]?.[name]) {
        setGuestErrors(prev => {
          const updated = [...prev];
          const e = { ...updated[idx] };
          delete e[name];
          updated[idx] = e;
          return updated;
        });
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
      if (errors[name]) {
        setErrors((prev) => { const e = { ...prev }; delete e[name]; return e; });
      }
    }
  };

  const handleZipcodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '').slice(0, 7);
    // 123-4567 フォーマット
    const formatted = raw.length > 3 ? `${raw.slice(0, 3)}-${raw.slice(3)}` : raw;
    setFormData(prev => ({ ...prev, zipcode: formatted }));
    if (errors.zipcode) {
      setErrors(prev => { const e = { ...prev }; delete e.zipcode; return e; });
    }

    if (raw.length === 7) {
      try {
        const res = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${raw}`);
        const json = await res.json();
        if (json.results && json.results[0]) {
          const { address1, address2, address3 } = json.results[0];
          setFormData(prev => ({ ...prev, address: `${address1}${address2}${address3}` }));
        }
      } catch {
        // 住所取得失敗は無視
      }
    }
  };

  const formatPhone = (digits: string): string => {
    const d = digits.slice(0, 11);
    // 携帯: 090/080/070/060 → 3-4-4
    if (/^0[7890]0/.test(d)) {
      if (d.length <= 3) return d;
      if (d.length <= 7) return `${d.slice(0, 3)}-${d.slice(3)}`;
      return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
    }
    // フリーダイヤル等: 0120/0800/0570 → 4-3-3
    if (/^(0120|0800|0570)/.test(d)) {
      if (d.length <= 4) return d;
      if (d.length <= 7) return `${d.slice(0, 4)}-${d.slice(4)}`;
      return `${d.slice(0, 4)}-${d.slice(4, 7)}-${d.slice(7)}`;
    }
    // 市外局番2桁 (03/06等) → 2-4-4
    if (/^0[36]/.test(d)) {
      if (d.length <= 2) return d;
      if (d.length <= 6) return `${d.slice(0, 2)}-${d.slice(2)}`;
      return `${d.slice(0, 2)}-${d.slice(2, 6)}-${d.slice(6)}`;
    }
    // その他固定電話 → 3-3-4
    if (d.length <= 3) return d;
    if (d.length <= 6) return `${d.slice(0, 3)}-${d.slice(3)}`;
    return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/[^0-9]/g, '');
    setFormData(prev => ({ ...prev, phone: formatPhone(digits) }));
    if (errors.phone) {
      setErrors(prev => { const e = { ...prev }; delete e.phone; return e; });
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

  const handleAddGuest = () => {
    const newId = ++guestIdCounter.current;
    setGuests(prev => [...prev, {
      status: 'attending',
      guestCategory: formData.guestCategory,
      japaneseFirstName: '',
      japaneseLastName: '',
      kanaFirstName: '',
      kanaLastName: '',
      email: '',
      dietaryRestrictions: 'without',
    }]);
    setGuestKeys(prev => [...prev, newId]);
    setGuestErrors(prev => [...prev, {}]);
    setEnteringKeys(prev => new Set(prev).add(newId));
    setTimeout(() => {
      setEnteringKeys(prev => {
        const next = new Set(prev);
        next.delete(newId);
        return next;
      });
    }, 500);
  };

  const handleRemoveGuest = (i: number) => {
    const keyToRemove = guestKeysRef.current[i];
    setRemovingKeys(prev => new Set(prev).add(keyToRemove));
    setTimeout(() => {
      const removeIdx = guestKeysRef.current.indexOf(keyToRemove);
      if (removeIdx !== -1) {
        setGuests(prev => prev.filter((_, j) => j !== removeIdx));
        setGuestKeys(prev => prev.filter((_, j) => j !== removeIdx));
        setGuestErrors(prev => prev.filter((_, j) => j !== removeIdx));
      }
      setRemovingKeys(prev => {
        const next = new Set(prev);
        next.delete(keyToRemove);
        return next;
      });
    }, 400);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setShowConfirmModal(true);
  };

  const submitRSVP = async () => {
    setIsLoading(true);
    setSubmitError(null);

    try {
      // お連れ様に主ゲストの郵便番号・住所・建物名を自動コピー
      const guestsWithAddress = guests.map(g => ({
        ...g,
        zipcode: formData.zipcode,
        address: formData.address,
        building: formData.building,
      }));
      const response = await rsvpClient.submitRSVP(formData, guestsWithAddress);

      if (response.statusCode === 201) {
        localStorage.setItem('rsvp_submitted', 'true');
        setShowSuccessModal(true);
        // Reset form after successful submission
        setFormData({
          status: 'attending',
          guestCategory: 'groom',
          japaneseFirstName: '',
          japaneseLastName: '',
          kanaFirstName: '',
          kanaLastName: '',
          email: '',
          dietaryRestrictions: 'without',
        });
        setGuests([]);
        setGuestKeys([]);
        setRemovingKeys(new Set());
        setEnteringKeys(new Set());
      } else {
        setSubmitError(response.message || 'An error occurred during submission.');
      }
    } catch (error) {
      if (error instanceof ApiError && error.statusCode === 400) {
        const translated = error.messages.map(translateValidationMessage);
        setSubmitError(translated.join('\n'));
      } else {
        const errorMessage = error instanceof Error ? error.message : 'ネットワークエラーが発生しました。しばらくしてから再度お試しください。';
        setSubmitError(errorMessage);
      }
      console.error('RSVP submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="rsvp" className="bg-white py-24">
      <div className="max-w-2xl mx-auto px-4">
        {!submitted && (
          <>
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
            <div className="flex flex-col items-center w-full">
              <div className="flex flex-row gap-24 justify-center w-full">
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

            {/* Kana Name */}
            <div className="bg-white rounded-lg p-6">
              <label className="block text-sm font-semibold text-gray-800 mb-4 ja" style={{fontFamily: 'var(--font-noto-sans-jp)'}}>
                <span className="text-red-500">*</span> お名前（かな）
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    name="kanaLastName"
                    placeholder="せい"
                    value={formData.kanaLastName || ''}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black ${
                      errors.kanaLastName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.kanaLastName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.kanaLastName}
                    </p>
                  )}
                </div>
                <div>
                  <input
                    type="text"
                    name="kanaFirstName"
                    placeholder="めい"
                    value={formData.kanaFirstName || ''}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black ${
                      errors.kanaFirstName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.kanaFirstName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.kanaFirstName}
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
                    <span className="text-red-500">*</span> 郵便番号
                  </label>
                  <input
                    type="text"
                    name="zipcode"
                    placeholder="123-4567"
                    value={formData.zipcode || ''}
                    onChange={handleZipcodeChange}
                    maxLength={8}
                    inputMode="numeric"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black ${errors.zipcode ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.zipcode && <p className="text-red-500 text-xs mt-1">{errors.zipcode}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-4 ja">
                    <span className="text-red-500">*</span> 住所
                  </label>
                  <input
                    type="text"
                    name="address"
                    placeholder="東京都港区..."
                    value={formData.address || ''}
                    onChange={e => handleInputChange(e)}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
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
                    <span className="text-red-500">*</span> 電話番号
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="090-1234-5678"
                    value={formData.phone || ''}
                    onChange={handlePhoneChange}
                    maxLength={13}
                    inputMode="numeric"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-black ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
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
                <span className="text-red-500">*</span> 年齢区分
              </label>
              <div className="grid grid-cols-2 gap-4 sm:flex sm:flex-nowrap sm:gap-6">
                {[
                  { value: 'adult', label: '大人' },
                  { value: 'child', label: '子供（～18歳頃）', sub: '大人と同じ食事' },
                  { value: 'infant', label: '幼児（～5歳頃）', sub: 'お子様ランチ' },
                  { value: 'baby', label: '新生児（～1歳頃）', sub: '食事不要' },
                ].map(option => {
                  const checked = formData.ageCategory === option.value;
                  return (
                    <label key={option.value} className="flex items-start cursor-pointer gap-2 shrink-0">
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
                      <span className="text-black text-sm ja whitespace-nowrap">
                        {option.label}
                        {'sub' in option && option.sub && (
                          <span className="block text-xs text-gray-500 font-normal whitespace-nowrap">※{option.sub}</span>
                        )}
                      </span>
                    </label>
                  );
                })}
              </div>
              {errors.ageCategory && <p className="text-red-500 text-xs mt-2">{errors.ageCategory}</p>}
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

            {/* 二次会 */}
            <div className="bg-white rounded-lg p-6">
              <label className="block text-sm font-semibold text-gray-800 mb-4 ja">
                二次会へのご参加
              </label>
              <label className="flex items-center cursor-pointer gap-2">
                <input
                  type="checkbox"
                  name="afterParty"
                  checked={formData.afterParty || false}
                  onChange={(e) => setFormData(prev => ({ ...prev, afterParty: e.target.checked }))}
                  className="sr-only"
                />
                <span
                  className={`w-8 h-8 border-2 rounded-sm flex items-center justify-center transition-colors duration-150 shrink-0 ${formData.afterParty ? 'bg-black border-black' : 'bg-white border-black'}`}
                />
                <span className="text-black text-base ja">参加希望</span>
              </label>
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
            {guests.map((guest, idx) => {
              const key = guestKeys[idx];
              const isRemoving = removingKeys.has(key);
              const isEntering = enteringKeys.has(key);
              return (
                <div
                  key={key}
                  className={isRemoving ? 'animate-guestFadeOut' : isEntering ? 'animate-guestFadeIn' : ''}
                >
                  <GuestInputForm
                    guest={guest}
                    index={idx}
                    errors={guestErrors[idx]}
                    onInputChange={handleInputChange}
                    onRadioChange={handleRadioChange}
                    onAllergyToggle={handleAllergyToggle}
                    onRemove={handleRemoveGuest}
                  />
                </div>
              );
            })}

            {/* お連れ様追加ボタン */}
            <div className="flex items-center justify-center gap-8">
              <button
                type="button"
                className="flex items-center gap-4 px-6 py-3 bg-white border-none text-black text-2xl font-normal focus:outline-none cursor-pointer"
                onClick={handleAddGuest}
              >
                <span className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-800 text-white text-3xl font-bold">＋</span>
                <span className="text-black text-2xl ja">お連れ様の追加</span>
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
                  <button
                    type="button"
                    onClick={onOpenTerms}
                    className="text-amber-700 hover:underline bg-transparent border-none p-0 cursor-pointer"
                  >
                    利用規約
                  </button>
                  をお読みの上、同意されます
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                disabled={!agreed || isLoading}
                className="w-150 px-8 py-3 text-white rounded-lg hover:bg-amber-800 disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer transition-colors font-semibold ja"
                style={{backgroundColor: 'rgb(118, 122, 37)'}}
              >
                {isLoading ? '送信中...' : '送信'}
              </button>
            </div>

            {/* Error Message */}
            {submitError && (
              <div className="mt-4 p-4 bg-red-100 border border-red-400 rounded-lg">
                <p className="text-red-800 text-sm ja whitespace-pre-line">{submitError}</p>
              </div>
            )}
          </form>
            </div>
          </>
        )}
      </div>

      {/* Confirmation Modal */}
      <SubmissionConfirmationModal
        isOpen={showConfirmModal}
        data={formData}
        onConfirm={() => {
          setShowConfirmModal(false);
          submitRSVP();
        }}
        onClose={() => setShowConfirmModal(false)}
      />

      {/* Success Modal */}
      <SubmissionSuccessModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          setSubmitted(true);
        }}
      />
    </section>
  );
};
