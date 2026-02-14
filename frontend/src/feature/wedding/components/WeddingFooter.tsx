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
      className={`bg-gray-900 text-white py-12 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-center md:text-left mb-6 md:mb-0">
            <p className="text-gray-400 text-sm">
              © 2026 Wedding Invitation. All rights reserved.
            </p>
            <div className="flex gap-4 justify-center md:justify-start mt-3 text-xs text-gray-500">
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms of Use
              </a>
            </div>
          </div>

          <button
            onClick={handleScrollToTop}
            className="flex items-center gap-2 px-4 py-2 bg-amber-900 hover:bg-amber-800 rounded-lg transition-colors"
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
            <span className="text-sm">Page Top</span>
          </button>
        </div>
      </div>
    </footer>
  );
}
