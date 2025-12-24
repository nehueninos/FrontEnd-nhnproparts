import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselProps {
  images: string[];
  interval?: number;
}

export const Carousel = ({ images, interval = 4000 }: CarouselProps) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  const prev = () => {
    setCurrent(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const next = () => {
    setCurrent(prev => (prev + 1) % images.length);
  };

  return (
    <div className="relative w-full h-64 md:h-96 overflow-hidden">
      {images.map((img, index) => (
        <img
          key={img}
          src={img}
          alt={`slide-${index}`}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            index === current ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}

      {/* Flecha izquierda */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full"
      >
        <ChevronLeft />
      </button>

      {/* Flecha derecha */}
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full"
      >
        <ChevronRight />
      </button>
    </div>
  );
};
