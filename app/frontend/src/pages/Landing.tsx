import React from 'react';
import { Header } from '../components/header/Header';
import { HeroSection } from '../components/sections/HeroSection';

import { Footer } from '../components/footer/Footer';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { TestimonialsCarousel } from '@/components/sections/TestimonialsCarousel';
import { FAQAccordion } from '@/components/sections/FAQAccordion';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Header />
      <main>
        <HeroSection />
        <HowItWorks />
        <TestimonialsCarousel />
        <FAQAccordion />
      </main>
      <Footer />
    </div>
  );
};

export default Landing; 