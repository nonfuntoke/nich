import React from 'react';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center w-full mb-12">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <React.Fragment key={index}>
          <div className="flex items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${
                index < currentStep
                  ? 'bg-[#23395B] text-white'
                  : index === currentStep
                  ? 'bg-white border-2 border-[#23395B] text-[#23395B]'
                  : 'bg-white text-gray-400 border-2 border-gray-200'
              }`}
            >
              {index < currentStep ? (
                <Check className="text-white" size={20} />
              ) : (
                <span className="bg-gradient-to-r from-[#23395B] to-blue-400 bg-clip-text text-transparent font-bold">
                  {index + 1}
                </span>
              )}
            </div>
            {index < totalSteps - 1 && (
              <div
                className={`h-0.5 w-16 transition-all duration-300 ${
                  index < currentStep ? 'bg-[#23395B]' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}