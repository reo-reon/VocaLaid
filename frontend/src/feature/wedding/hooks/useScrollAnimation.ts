'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * スクロール時にアニメーションをトリガーするカスタムフック
 * - threshold: 0 + rootMargin なしで Android / iPhone Safari 両対応
 * - 2秒後のフォールバックで IntersectionObserver が発火しない場合も救済
 */
export function useScrollAnimation(_threshold = 0.1) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;

    // 2秒後に強制的に表示（Safari iOS などで observer が発火しない保険）
    const fallbackTimer = setTimeout(() => setIsVisible(true), 2000);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          clearTimeout(fallbackTimer);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0 }
    );

    observer.observe(currentRef);

    return () => {
      clearTimeout(fallbackTimer);
      observer.unobserve(currentRef);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ref, isVisible };
}
