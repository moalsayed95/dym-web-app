import { FAQItem } from '../ui/FAQItem';

export const FAQAccordion: React.FC = () => {
  const faqs = [
    {
      question: "How does DYM's AI therapy work?",
      answer: "DYM uses advanced AI to provide evidence-based therapeutic conversations, drawing from CBT, ACT, and other proven approaches. The AI adapts to your responses and needs, offering personalized support and exercises."
    },
    {
      question: "Is my data private and secure?",
      answer: "Yes, absolutely. We use military-grade encryption and follow HIPAA guidelines. Your conversations are private, and we never share your personal information without your explicit consent."
    },
    {
      question: "Can I switch between AI and human therapists?",
      answer: "Yes! You can use our AI support independently or alongside therapy. When you're ready, we'll help match you with a licensed therapist who fits your needs and preferences."
    },
    {
      question: "What if I'm having a mental health crisis?",
      answer: "If you're in crisis, please contact emergency services or our 24/7 crisis helpline immediately. DYM provides crisis resources and direct connections to urgent support services."
    },
    {
      question: "How much does therapy cost with DYM?",
      answer: "We offer a free plan with basic features and a Pro plan with unlimited AI sessions and additional benefits. Therapy sessions with licensed professionals are billed separately at competitive rates, often covered by insurance."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Frequently Asked Questions
        </h2>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
            />
          ))}
        </div>
      </div>
    </section>
  );
}; 