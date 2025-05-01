import React from 'react';
import RealTimeChat from '../chat/RealTimeChat';

export const HeroSection: React.FC = () => {
  return (
    <section className="py-32 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Discover what is on your mind
          </h1>
          <p className="text-lg md:text-xl text-gray-600">
            Your safe space for self-discovery, with a path to professional support when you're ready.
          </p>
        </div>

        <div className="max-w-8xl mx-auto">
          <RealTimeChat />
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              🔒 Private & encrypted
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}; 