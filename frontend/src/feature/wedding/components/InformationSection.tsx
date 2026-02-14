'use client';

import { Event } from '../types';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface InformationSectionProps {
  ceremony: Event;
  reception: Event;
}

export function InformationSection({
  ceremony,
  reception,
}: InformationSectionProps) {
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation(0.2);
  const { ref: ceremonyRef, isVisible: ceremonyVisible } =
    useScrollAnimation(0.2);
  const { ref: receptionRef, isVisible: receptionVisible } =
    useScrollAnimation(0.2);

  const EventCard = ({
    event,
    isVisible,
    delay = 0,
  }: {
    event: Event;
    isVisible: boolean;
    delay?: number;
  }) => (
    <div
      className={`bg-amber-50 rounded-lg p-8 transition-all duration-1000 ${
        delay ? `delay-${delay}` : ''
      } ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      <h3 className="text-2xl font-light mb-2 text-amber-900 ja" style={{fontFamily: 'var(--font-noto-sans-jp)', fontWeight: 600}}>
        {event.type === 'ceremony' ? '挙式' : '披露宴'}
      </h3>
      <p className="text-xs text-gray-600 mb-6 en" style={{fontFamily: 'var(--font-playfair)', letterSpacing: '0.05em'}}>
        {event.type === 'ceremony' ? 'WEDDING CEREMONY' : 'WEDDING RECEPTION'}
      </p>

      <div className="space-y-4 mb-8">
        <div>
          <p className="text-sm text-gray-600 ja" style={{fontFamily: 'var(--font-noto-sans-jp)'}}>日時</p>
          <p className="text-lg font-semibold text-gray-800">
            {event.date} {event.weekday}
          </p>
          <p className="text-lg font-semibold text-amber-900">{event.time}</p>
        </div>

        <div>
          <p className="text-sm text-gray-600 ja" style={{fontFamily: 'var(--font-noto-sans-jp)'}}>会場</p>
          <p className="text-lg font-semibold text-gray-800">
            {event.venue.name}
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-600 ja" style={{fontFamily: 'var(--font-noto-sans-jp)'}}>住所</p>
          <p className="text-sm text-gray-800">{event.venue.address}</p>
        </div>

        {event.venue.phone && (
          <div>
            <p className="text-sm text-gray-600 ja" style={{fontFamily: 'var(--font-noto-sans-jp)'}}>電話番号</p>
            <a
              href={`tel:${event.venue.phone}`}
              className="text-sm text-amber-700 hover:underline"
            >
              {event.venue.phone}
            </a>
          </div>
        )}

        {event.venue.website && (
          <div>
            <p className="text-sm text-gray-600 ja" style={{fontFamily: 'var(--font-noto-sans-jp)'}}>ウェブサイト</p>
            <a
              href={event.venue.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-amber-700 hover:underline break-all"
            >
              {event.venue.website}
            </a>
          </div>
        )}
      </div>

      {event.venue.mapUrl && (
        <div className="rounded-lg overflow-hidden h-80">
          <iframe
            src={event.venue.mapUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      )}
    </div>
  );

  return (
    <section id="information" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        {/* Title */}
        <div
          ref={titleRef}
          className={`text-center mb-16 transition-all duration-1000 ${
            titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-light mb-4" style={{fontFamily: 'var(--font-playfair)'}}>
            <span className="text-xs text-gray-600 block mb-2 en" style={{fontFamily: 'var(--font-playfair)', letterSpacing: '0.05em'}}>INFORMATION</span>
            <span className="text-amber-900 ja" style={{fontFamily: 'var(--font-noto-sans-jp)'}}>ご案内</span>
          </h2>
        </div>

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div
            ref={ceremonyRef}
            className="transition-all duration-1000"
          >
            <EventCard event={ceremony} isVisible={ceremonyVisible} delay={0} />
          </div>
          <div
            ref={receptionRef}
            className="transition-all duration-1000 delay-200"
          >
            <EventCard event={reception} isVisible={receptionVisible} delay={200} />
          </div>
        </div>
      </div>
    </section>
  );
}
