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
  const { ref: titleRef, isVisible: titleVisible } = useScrollAnimation(0.05);
  const { ref: ceremonyRef, isVisible: ceremonyVisible } =
    useScrollAnimation(0.05);
  const { ref: receptionRef, isVisible: receptionVisible } =
    useScrollAnimation(0.05);

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
      className={`rounded-lg p-8 transition-all duration-500 ${
        delay ? `delay-${delay}` : ''
      } ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
    >
      <h3 className="text-2xl font-light mb-2 text-slate-700 en en text-center" style={{fontWeight: 400, letterSpacing: '0.05em'}}>
        WEDDING<br/>{event.type === 'ceremony' ? 'CEREMONY' : 'RECEPTION'}
      </h3>
      <p className="text-xs text-slate-900 mb-6 ja ja text-center" style={{fontWeight: 300}}>
        {event.type === 'ceremony' ? '挙式' : '披露宴'}
      </p>

      <div className="space-y-4 mb-8">
        <div>
          <p className="text-sm text-gray-600 ja">日時</p>
          <p className="text-lg font-semibold text-gray-800 en">
            {event.date} {event.weekday}
          </p>
          <p className="text-lg font-semibold text-amber-900 en">{event.time}</p>
        </div>

        <div>
          <p className="text-sm text-gray-600 ja">会場</p>
          <p className="text-lg font-semibold text-gray-800 en">
            {event.venue.name}
          </p>
        </div>

        {event.venue.address && (
          <div>
            <p className="text-sm text-gray-600 ja">住所</p>
            <p className="text-sm text-gray-800 ja">{event.venue.address}</p>
          </div>
        )}

        {event.venue.phone && (
          <div>
            <p className="text-sm text-gray-600 ja">電話番号</p>
            <a
              href={`tel:${event.venue.phone}`}
              className="text-sm text-amber-700 hover:underline en"
            >
              {event.venue.phone}
            </a>
          </div>
        )}

        {event.venue.website && (
          <div>
            <p className="text-sm text-gray-600 ja">ウェブサイト</p>
            <a
              href={event.venue.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-amber-700 hover:underline break-all en"
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
    <section id="information" className="py-16 md:py-24" style={{backgroundColor: 'rgb(239, 239, 236)'}}>
      <div className="container mx-auto px-4">
        {/* Title */}
        <div
          ref={titleRef}
          className={`text-center mb-16 transition-all duration-500 ${
            titleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2>
            <span className="block text-slate-700 en" style={{letterSpacing: '0.05em', fontSize: '42px', fontWeight: 400}}>INFORMATION</span>
            <span className="block text-slate-900 ja" style={{fontSize: '15px', fontWeight: 400, marginTop: '-8px'}}>ご案内</span>
          </h2>
        </div>

        {/* Events Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div
            ref={ceremonyRef}
            className="transition-all duration-500"
          >
            <EventCard event={ceremony} isVisible={ceremonyVisible} delay={0} />
          </div>
          <div
            ref={receptionRef}
            className="transition-all duration-500"
          >
            <EventCard event={reception} isVisible={receptionVisible} delay={200} />
          </div>
        </div>
      </div>
    </section>
  );
}
