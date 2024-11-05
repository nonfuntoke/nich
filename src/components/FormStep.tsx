import React from 'react';

interface FormStepProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export function FormStep({ title, description, children }: FormStepProps) {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-[#23395B] mb-2">{title}</h2>
        <p className="text-gray-600">{description}</p>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        {children}
      </div>
    </div>
  );
}