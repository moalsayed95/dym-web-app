import React from 'react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      number: '1',
      title: 'Chat & reflect',
      description: 'Start with AI-guided conversations that help you explore your thoughts and feelings'
    },
    {
      number: '2',
      title: 'Get personalized exercises',
      description: 'Receive tailored therapeutic exercises and activities based on your needs'
    },
    {
      number: '3',
      title: 'Match with a therapist',
      description: 'When ready, connect with a professional therapist who matches your preferences'
    }
  ];

  return (
    <section className="py-8 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">
          How DYM Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step) => (
            <div
              key={step.number}
              className="relative flex flex-col items-center text-center"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 
                            flex items-center justify-center text-white text-xl font-bold mb-6">
                {step.number}
              </div>
              
              {/* Connector line */}
              {step.number !== '3' && (
                <div className="hidden md:block absolute top-6 left-[60%] w-[80%] h-[2px] 
                              bg-gradient-to-r from-blue-500 to-blue-600" />
              )}

              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-gray-600 max-w-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}; 