import React from 'react';
import RealTimeChat from '../chat/RealTimeChat';

export const HeroSection: React.FC = () => {
  return (
    <section className="py-24 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Your Journey to Better Mental Health Starts Here
          </h1>
          <p className="text-lg md:text-xl text-gray-600">
            Experience personalized AI-guided therapy that adapts to your needs,
            backed by mental health professionals.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
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