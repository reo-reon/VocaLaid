import { useEffect, useState } from 'react';

/**
 * 画像パスの配列を受け取りクロスフェードスライドショーを行うフック
 * @param images  表示する画像パスの配列
 * @param interval 切り替え間隔（ミリ秒）デフォルト 5000ms
 */
export function useImageSlideshow(
  images: string[],
  interval = 5000,
) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    setCurrentIndex(0);
    const timer = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % images.length);
    }, interval);
    return () => clearInterval(timer);
  }, [images, interval]);

  return {
    currentIndex,
    currentImage: images[currentIndex] ?? '',
  };
}
