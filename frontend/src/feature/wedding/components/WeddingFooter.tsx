'use client';

import { useScrollAnimation } from '../hooks/useScrollAnimation';

export function WeddingFooter() {
  const { ref, isVisible } = useScrollAnimation(0.5);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      ref={ref}
      className={`text-white py-12 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{backgroundColor: 'rgb(88, 93, 61)'}}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-6 md:mb-0">
            <p className="text-white text-sm en">
              © 2026 Wedding Invitation. All rights reserved.
            </p>
            <div className="flex gap-4 justify-center md:justify-start mt-3 text-xs">
              <a href="#" className="text-white hover:text-amber-200 transition-colors en">
                Privacy Policy
              </a>
              <a href="#" className="text-white hover:text-amber-200 transition-colors en">
                Terms of Use
              </a>
            </div>
          </div>

          <button
            onClick={handleScrollToTop}
            className="flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-white"
            style={{backgroundColor: 'rgb(197, 156, 57)'}}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
            <span className="text-sm en text-white">Page Top</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
