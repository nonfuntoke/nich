import React from 'react';
import { ChevronRight, TrendingUp, Users, Target, LineChart } from 'lucide-react';

interface RecommendationCardProps {
  title: string;
  description: string;
  metrics: string[];
  audience: string[];
  content: string[];
  strategy: string[];
}

export function RecommendationCard({
  title,
  description,
  metrics,
  audience,
  content,
  strategy,
}: RecommendationCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden">
      <div className="bg-[#23395B]/5 p-4">
        <h3 className="text-xl font-bold text-[#23395B]">{title}</h3>
        <p className="text-gray-600 mt-2">{description}</p>
      </div>

      <div className="p-6 space-y-6">
        <Section icon={TrendingUp} title="Popularity Metrics">
          <ul className="space-y-2">
            {metrics.map((metric, index) => (
              <li key={index} className="flex items-start space-x-2">
                <ChevronRight className="w-4 h-4 text-[#23395B] mt-1 flex-shrink-0" />
                <span className="text-gray-700">{metric}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section icon={Users} title="Target Audience">
          <ul className="space-y-2">
            {audience.map((item, index) => (
              <li key={index} className="flex items-start space-x-2">
                <ChevronRight className="w-4 h-4 text-[#23395B] mt-1 flex-shrink-0" />
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section icon={Target} title="Content Strategy">
          <ul className="space-y-2">
            {content.map((item, index) => (
              <li key={index} className="flex items-start space-x-2">
                <ChevronRight className="w-4 h-4 text-[#23395B] mt-1 flex-shrink-0" />
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section icon={LineChart} title="Competitive Strategy">
          <ul className="space-y-2">
            {strategy.map((item, index) => (
              <li key={index} className="flex items-start space-x-2">
                <ChevronRight className="w-4 h-4 text-[#23395B] mt-1 flex-shrink-0" />
                <span className="text-gray-700">{item}</span>
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </div>
  );
}

function Section({ 
  icon: Icon, 
  title, 
  children 
}: { 
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center space-x-2">
        <Icon className="w-5 h-5 text-[#23395B]" />
        <h4 className="font-semibold text-[#23395B]">{title}</h4>
      </div>
      {children}
    </div>
  );
}