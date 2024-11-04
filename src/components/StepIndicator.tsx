import React from 'react';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

export function StepIndicator({ currentStep, totalSteps }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center w-full mb-8">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <React.Fragment key={index}>
          <div className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                index < currentStep
                  ? 'bg-[#23395b] text-white'
                  : index === currentStep
                  ? 'bg-white border-2 border-[#23395b] text-[#23395b]'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {index < currentStep ? (
                <Check size={16} />
              ) : (
                <span>{index + 1}</span>
              )}
            </div>
            {index < totalSteps - 1 && (
              <div
                className={`h-0.5 w-12 ${
                  index < currentStep ? 'bg-[#23395b]' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}