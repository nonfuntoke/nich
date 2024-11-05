import React from 'react';
import { Sparkles } from 'lucide-react';
import { RecommendationCard } from './RecommendationCard';

interface RecommendationsSectionProps {
  recommendations: string;
}

export function RecommendationsSection({ recommendations }: RecommendationsSectionProps) {
  const parseRecommendations = (text: string) => {
    const sections = text.split('\n\n').filter(Boolean);
    return sections.map(section => {
      const lines = section.split('\n');
      const title = lines[0].replace(/^\d+\.\s*/, '');
      
      const getSection = (startMarker: string, endMarkers: string[]) => {
        const start = lines.findIndex(line => line.includes(startMarker));
        if (start === -1) return [];
        
        const end = lines.findIndex((line, i) => 
          i > start && endMarkers.some(marker => line.includes(marker))
        );
        
        return lines
          .slice(start + 1, end === -1 ? undefined : end)
          .map(line => line.replace(/^\*\s*/, ''))
          .filter(Boolean);
      };

      return {
        title,
        description: lines[1]?.replace(/^\*\s*/, '') || '',
        metrics: getSection('Popularity Metrics', ['Audience Segmentation', 'Content Ideas', 'Analysis']),
        audience: getSection('Audience Segmentation', ['Content Ideas', 'Analysis', 'Popularity Metrics']),
        content: getSection('Content Ideas', ['Analysis', 'Popularity Metrics', 'Audience Segmentation']),
        strategy: getSection('Analysis', ['Content Ideas', 'Popularity Metrics', 'Audience Segmentation']),
      };
    });
  };

  const parsedRecommendations = parseRecommendations(recommendations);

  return (
    <div className="mt-8 space-y-8">
      <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
        <Sparkles className="w-6 h-6 text-[#23395B]" />
        <h2 className="text-2xl font-bold bg-gradient-to-r from-[#23395B] to-blue-400 bg-clip-text text-transparent">
          Your Personalized Recommendations
        </h2>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {parsedRecommendations.map((recommendation, index) => (
          <RecommendationCard key={index} {...recommendation} />
        ))}
      </div>

      <div className="pt-4 border-t border-gray-200">
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#23395B] rounded-full transition-all duration-1000"
            style={{ width: '100%' }}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2 text-center">
          Analysis complete • {parsedRecommendations.length} niches identified
        </p>
      </div>
    </div>
  );
}