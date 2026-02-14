'use client';

import Image from 'next/image';
import { Person } from '../types';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface MessageSectionProps {
  groom: Person;
  bride: Person;
  greetingMessage: string;
}

export function MessageSection({
  groom,
  bride,
  greetingMessage,
}: MessageSectionProps) {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation(0.2);
  const { ref: contentRef, isVisible: contentVisible } = useScrollAnimation(0.2);
  const { ref: groomRef, isVisible: groomVisible } = useScrollAnimation(0.2);
  const { ref: brideRef, isVisible: brideVisible } = useScrollAnimation(0.2);

  return (
    <section id="message" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Title */}
        <div
          ref={titleRef}
          className={`text-center mb-16 transition-all duration-1000 ${
            titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-light mb-4" style={{fontFamily: 'var(--font-playfair)'}}>
            <span className="text-xs text-gray-600 block mb-2 en" style={{fontFamily: 'var(--font-playfair)', letterSpacing: '0.05em'}}>MESSAGE</span>
            <span className="text-amber-900 ja" style={{fontFamily: 'var(--font-noto-sans-jp)'}}>メッセージ</span>
          </h2>
        </div>

        {/* Greeting Message */}
        <div
          ref={contentRef}
          className={`max-w-2xl mx-auto text-center mb-16 transition-all duration-1000 delay-300 ${
            contentVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm md:text-base ja" style={{fontFamily: 'var(--font-noto-sans-jp)', lineHeight: 1.9}}>
            {greetingMessage}
          </p>
        </div>

        {/* Groom and Bride Section */}
        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Groom */}
          <div
            ref={groomRef}
            className={`text-center transition-all duration-1000 ${
              groomVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
              <Image
                src={groom.profileImage}
                alt={groom.romanFirstName}
                width={600}
                height={800}
                className="w-full h-96 object-cover"
              />
            </div>
            <div className="mb-6">
              <p className="text-2xl font-light mb-2 en" style={{fontFamily: 'var(--font-playfair)'}}>
                <span className="font-semibold">{groom.romanFirstName}</span>{' '}
                <span>{groom.romanLastName}</span>
              </p>
              <p className="text-lg font-semibold text-amber-900 mb-4 ja" style={{fontFamily: 'var(--font-noto-sans-jp)'}}>
                {groom.japaneseLastName} {groom.japaneseFirstName}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                {groom.birthDate} 生まれ
              </p>
              <p className="text-sm text-gray-600">{groom.bloodType}型</p>
            </div>
            <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-wrap ja" style={{fontFamily: 'var(--font-noto-sans-jp)', lineHeight: 1.9}}>
              {groom.introduction}
            </p>
          </div>

          {/* Bride */}
          <div
            ref={brideRef}
            className={`text-center transition-all duration-1000 delay-200 ${
              brideVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="mb-8 rounded-lg overflow-hidden shadow-lg">
              <Image
                src={bride.profileImage}
                alt={bride.romanFirstName}
                width={600}
                height={800}
                className="w-full h-96 object-cover"
              />
            </div>
            <div className="mb-6">
              <p className="text-2xl font-light mb-2 en" style={{fontFamily: 'var(--font-playfair)'}}>
                <span className="font-semibold">{bride.romanFirstName}</span>{' '}
                <span>{bride.romanLastName}</span>
              </p>
              <p className="text-lg font-semibold text-amber-900 mb-4 ja" style={{fontFamily: 'var(--font-noto-sans-jp)'}}>
                {bride.japaneseLastName} {bride.japaneseFirstName}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                {bride.birthDate} 生まれ
              </p>
              <p className="text-sm text-gray-600">{bride.bloodType}型</p>
            </div>
            <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-wrap ja" style={{fontFamily: 'var(--font-noto-sans-jp)', lineHeight: 1.9}}>
              {bride.introduction}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
