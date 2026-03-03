'use client';

import { useEffect, useRef, useState } from 'react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

interface HeaderProps {
  groomName: string;
  brideName: string;
  date: string;
  venue: string;
  backgroundImage: string;
  onNavClick?: (section: string) => void;
}

export function WeddingHeader({
  groomName,
  brideName,
  date,
  venue: _venue,
  backgroundImage,
  onNavClick,
}: HeaderProps) {
  const { ref, isVisible } = useScrollAnimation(0.3);
  const [scrollY, setScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  const handleNavClick = (section: string) => {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      onNavClick?.(section);
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="relative w-full overflow-hidden">
      {/* Background Image with Parallax */}
      <div
        className="absolute inset-0 w-full h-screen overflow-hidden"
        style={{
          transform: `translateY(${scrollY * 0.5}px)`,
        }}
      >
        <img
          src={backgroundImage}
          alt="Wedding background"
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            objectPosition: 'top',
          }}
        />
        <div className="absolute inset-0 bg-black/25" />
      </div>

        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-40 bg-white" ref={menuRef}>
          <div className="container mx-auto px-4 py-4 flex items-center justify-center">
            {/* Desktop menu */}
            <div className="hidden md:flex gap-70">
              <button
                onClick={() => handleNavClick('message')}
                className="text-black hover:text-amber-700 transition-colors en"
                style={{letterSpacing: '0.08em'}}
              >
                <span className="block text-black en" style={{fontSize: '16px', fontWeight: 400}}>MESSAGE</span>
                <span className="block ja text-gray-700" style={{fontSize: '9px', fontWeight: 400, marginTop: '4px'}}>メッセージ</span>
              </button>
              <button
                onClick={() => handleNavClick('information')}
                className="text-black hover:text-amber-700 transition-colors en"
                style={{letterSpacing: '0.08em'}}
              >
                <span className="block text-black en" style={{fontSize: '16px', fontWeight: 400}}>INFORMATION</span>
                <span className="block ja text-gray-700" style={{fontSize: '9px', fontWeight: 400, marginTop: '4px'}}>ご案内</span>
              </button>
              <button
                onClick={() => handleNavClick('rsvp')}
                className="text-black hover:text-amber-700 transition-colors en"
                style={{letterSpacing: '0.08em'}}
              >
                <span className="block text-black en" style={{fontSize: '16px', fontWeight: 400}}>R.S.V.P.</span>
                <span className="block ja text-gray-700" style={{fontSize: '9px', fontWeight: 400, marginTop: '4px'}}>ご出欠</span>
              </button>
            </div>

            {/* Hamburger button (mobile / tablet) */}
            <button
              className="md:hidden ml-auto flex flex-col justify-center items-center w-10 h-10 gap-1.5"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-label={isMenuOpen ? 'メニューを閉じる' : 'メニューを開く'}
            >
              <span
                className={`block w-6 h-0.5 bg-black transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}
              />
              <span
                className={`block w-6 h-0.5 bg-black transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}
              />
              <span
                className={`block w-6 h-0.5 bg-black transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}
              />
            </button>
          </div>

          {/* Mobile dropdown menu */}
          <div
            className={`md:hidden overflow-hidden transition-all duration-300 ${
              isMenuOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="flex flex-col items-center gap-4 pb-4 border-t border-gray-100">
              <button
                onClick={() => handleNavClick('message')}
                className="text-black hover:text-amber-700 transition-colors en pt-4"
                style={{letterSpacing: '0.08em'}}
              >
                <span className="block text-black en" style={{fontSize: '15px', fontWeight: 400}}>MESSAGE</span>
                <span className="block ja text-gray-700 text-center" style={{fontSize: '9px', fontWeight: 400, marginTop: '4px'}}>メッセージ</span>
              </button>
              <button
                onClick={() => handleNavClick('information')}
                className="text-black hover:text-amber-700 transition-colors en"
                style={{letterSpacing: '0.08em'}}
              >
                <span className="block text-black en" style={{fontSize: '15px', fontWeight: 400}}>INFORMATION</span>
                <span className="block ja text-gray-700 text-center" style={{fontSize: '9px', fontWeight: 400, marginTop: '4px'}}>ご案内</span>
              </button>
              <button
                onClick={() => handleNavClick('rsvp')}
                className="text-black hover:text-amber-700 transition-colors en"
                style={{letterSpacing: '0.08em'}}
              >
                <span className="block text-black en" style={{fontSize: '15px', fontWeight: 400}}>R.S.V.P.</span>
                <span className="block ja text-gray-700 text-center" style={{fontSize: '9px', fontWeight: 400, marginTop: '4px'}}>ご出欠</span>
              </button>
            </div>
          </div>
        </nav>

      {/* Hero Content */}
      <div
        ref={ref}
        className="relative h-screen flex flex-col items-center justify-center text-center text-white px-4 pt-32"
      >
        {/* Quote Section - Top Right */}
        <p 
          className={`absolute top-24 right-8 md:right-16 text-sm md:text-lg font-light tracking-widest en max-w-xs md:max-w-sm text-right transform transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
          }`}
          style={{fontSize: '1.3rem', letterSpacing: '0.05em'}}
        >
          &quot; Our joy will be more complete,{' '}
          <br /> if you can share it with us &quot;
        </p>

        <div
          className={`transform transition-all duration-1000 ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          <div className="mb-16">
            <h1 className="font-light mb-6 letter-spacing en" style={{fontSize: 'clamp(32px, 10vw, 62px)', fontWeight: 700, lineHeight: 1.1, letterSpacing: '0.15em'}}>
              WEDDING
              <br />
              INVITATION
            </h1>
          </div>

          <div
            className={`transform transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <p className="text-2xl md:text-3xl font-light mb-6 en" style={{letterSpacing: '0.03em'}}>
              <span className="font-light">{groomName.split(' ')[0]}</span>
              <span className="mx-3">and</span>
              <span className="font-light">{brideName.split(' ')[0]}</span>
            </p>
            <p className="text-sm md:text-base font-light mb-3 en" style={{letterSpacing: '0.1em'}}>{date}</p>
            <p className="text-sm md:text-base font-light en flex items-center justify-center gap-3" style={{letterSpacing: '0.1em'}}>
              <a href="https://www.thesodoh.com/wedding/" className="inline-block">
                <img 
                  src="https://www.thesodoh.com/mg/wp-content/themes/sodoh_2024/shared/img/common/logo.svg" 
                  alt="THE SODOH HIGASHIYAMA KYOTO"
                  className="h-10 md:h-14"
                  style={{filter: 'brightness(0) invert(1)'}}
                />
              </a>
            </p>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div
          className={`absolute bottom-12 left-1/2 transform -translate-x-1/2 animate-bounce ${
            isVisible ? 'opacity-100' : 'opacity-0'
          } transition-opacity duration-1000 delay-500`}
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>
    </header>
  );
}
