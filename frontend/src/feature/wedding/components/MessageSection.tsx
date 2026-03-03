import Image from 'next/image';
import { Person } from '../types';

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
  return (
    <section id="message" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Title */}
        <div className="text-center mb-16">
          <h2>
            <span className="block text-black-700 en" style={{letterSpacing: '0.05em', fontSize: '42px', fontWeight: 400}}>MESSAGE</span>
            <span className="block text-black-900 ja" style={{fontSize: '15px', fontWeight: 400, marginTop: '-8px'}}>メッセージ</span>
          </h2>
        </div>

        {/* Greeting Message */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <p className="text-black-700 leading-relaxed whitespace-pre-wrap md:text-base ja" style={{lineHeight: 1.9,letterSpacing: '0.15em'}}>
            {greetingMessage}
          </p>
        </div>

        {/* Groom and Bride Section */}
        <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Groom */}
          <div className="text-center">
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
              <p className="text-2xl font-light mb-2 en" style={{fontSize: '3rem', fontWeight: 100, lineHeight: 1.1, letterSpacing: '0.1em'}}>
                <span>{groom.romanFirstName}</span><br />
                <span>{groom.romanLastName}</span>
              </p>
              <p className="text-lg text-black-900 mb-4 ja" style={{fontSize: '1.2rem'}}>
                {groom.japaneseLastName} {groom.japaneseFirstName}
              </p>
              <p className="text-sm text-black-600 mb-2">
                {groom.birthDate} 生まれ
              </p>
              <p className="text-sm text-black-600">{groom.bloodType}型</p>
            </div>
            <p className="text-black-700 leading-relaxed text-sm whitespace-pre-wrap ja" style={{lineHeight: 1.9}}>
              {groom.introduction}
            </p>
          </div>

          {/* Bride */}
          <div className="text-center">
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
              <p className="text-2xl font-light mb-2 en" style={{fontSize: '3rem', fontWeight: 100, lineHeight: 1.1, letterSpacing: '0.1em'}}>
                <span>{bride.romanFirstName}</span><br />
                <span>{bride.romanLastName}</span>
              </p>
              <p className="text-lg text-black-900 mb-4 ja" style={{fontSize: '1.2rem'}}>
                {bride.japaneseLastName} {bride.japaneseFirstName}
              </p>
              <p className="text-sm text-black-600 mb-2">
                {bride.birthDate} 生まれ
              </p>
              <p className="text-sm text-black-600">{bride.bloodType}型</p>
            </div>
            <p className="text-black-700 leading-relaxed text-sm whitespace-pre-wrap ja" style={{lineHeight: 1.9}}>
              {bride.introduction}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
