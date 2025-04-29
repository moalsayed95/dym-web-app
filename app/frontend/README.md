# DYM Frontend

This is the frontend application for Discover Your Mind (DYM), a mental health platform that combines AI-guided therapy with professional human support.

## Tech Stack

- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- Vite
- React Router

## Project Structure

```
src/
├─ components/
│  ├─ header/
│  │  └─ Header.tsx
│  ├─ sections/
│  │  ├─ HeroSection.tsx
│  │  ├─ TrustBar.tsx
│  │  ├─ FeatureHighlights.tsx
│  │  ├─ HowItWorks.tsx
│  │  ├─ TestimonialsCarousel.tsx
│  │  ├─ PricingPreview.tsx
│  │  └─ FAQAccordion.tsx
│  ├─ chat-demo/
│  │  └─ ChatDemo.tsx
│  ├─ ui/
│  │  ├─ WaveBackdrop.tsx
│  │  ├─ FeatureCard.tsx
│  │  └─ FAQItem.tsx
│  └─ footer/
│     └─ Footer.tsx
├─ pages/
│  └─ Landing.tsx
└─ assets/
   └─ logos/
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## Design System

- Colors:
  - Primary: Blue gradient (#6884FF → #7EDFFF)
  - Text: Gray scale (900-400)
  - Background: White, Gray-50

- Typography:
  - Font: Inter
  - Headings: 4xl-xl
  - Body: Base-lg

- Components:
  - Buttons: Rounded-full
  - Cards: Rounded-2xl
  - Shadows: sm-xl

## Features

- Responsive design
- Interactive chat demo
- Animated transitions
- Accessible components
- SEO optimized
- Performance focused

## Development Guidelines

1. Follow component-based architecture
2. Use TypeScript for type safety
3. Implement responsive design
4. Ensure accessibility (WCAG)
5. Optimize performance
6. Write clean, maintainable code

## Contributing

1. Create feature branch
2. Make changes
3. Submit pull request
4. Code review
5. Merge to main

## License

Private - All rights reserved 