import { FormData } from '../types/form';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

export class APIError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'APIError';
  }
}

export async function generateRecommendations(formData: FormData): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new APIError('API key is not configured');
  }

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Based on the following user profile:
              - Industry: ${formData.industry}
              - Audience Demographics: Age ${formData.demographics.ageRange}, Location ${formData.demographics.location}, Interests ${formData.demographics.interests.join(', ')}
              - Content Focus: ${formData.campaign.contentFocus}
              - Campaign Goals: ${formData.campaign.goals.join(', ')}
              - Trends/Topics of Interest: ${formData.trends.join(', ')}

              Recommend 3-5 trending, high-potential email marketing niches. For each niche, provide:
              1. A brief description and popularity metrics
              2. Recommended audience segmentation
              3. Specific content ideas, email subject lines, and messaging styles
              4. Analysis of competitors and differentiation strategies`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new APIError(errorData.error?.message || 'Failed to fetch recommendations');
    }

    const data = await response.json();
    
    if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new APIError('Invalid response format from API');
    }

    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError('Failed to connect to the API');
  }
}