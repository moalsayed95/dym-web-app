import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Testimonial {
  id: number;
  quote: string;
  initials: string;
  location: string;
}

export const TestimonialsCarousel: React.FC = () => {
  const testimonials: Testimonial[] = [
    {
      id: 1,
      quote: "DYM helped me understand my anxiety better than years of self-help books.",
      initials: "M.K.",
      location: "New York"
    },
    {
      id: 2,
      quote: "The AI conversations feel surprisingly natural and helped me open up.",
      initials: "R.S.",
      location: "London"
    },
    {
      id: 3,
      quote: "Found an amazing therapist through DYM. The matching was spot-on.",
      initials: "J.L.",
      location: "Toronto"
    },
    {
      id: 4,
      quote: "Daily check-ins have become an essential part of my mental wellness routine.",
      initials: "A.P.",
      location: "Sydney"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    if (!autoplay) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoplay, testimonials.length]);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          What Our Users Say
        </h2>

        <div 
          className="relative max-w-4xl mx-auto"
          onMouseEnter={() => setAutoplay(false)}
          onMouseLeave={() => setAutoplay(true)}
        >
          <div className="overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center text-center"
              >
                <blockquote className="text-xl md:text-2xl text-gray-700 mb-6">
                  "{testimonials[currentIndex].quote}"
                </blockquote>
                <cite className="not-italic">
                  <span className="font-semibold text-gray-900">
                    {testimonials[currentIndex].initials}
                  </span>
                  <span className="text-gray-500 ml-2">
                    {testimonials[currentIndex].location}
                  </span>
                </cite>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-center space-x-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  setAutoplay(false);
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'bg-blue-600 w-4'
                    : 'bg-gray-300'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}; 