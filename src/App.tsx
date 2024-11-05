import React, { useState } from 'react';
import { Sparkles, Mail } from 'lucide-react';
import { StepIndicator } from './components/StepIndicator';
import { FormStep } from './components/FormStep';
import { Button } from './components/Button';
import { FormData, initialFormData } from './types/form';
import { generateRecommendations, APIError } from './services/api';

function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleIndustryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, industry: e.target.value });
  };

  const handleDemographicsChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      demographics: { ...formData.demographics, [field]: value },
    });
  };

  const handleInterestsChange = (interest: string) => {
    const interests = formData.demographics.interests.includes(interest)
      ? formData.demographics.interests.filter((i) => i !== interest)
      : [...formData.demographics.interests, interest];
    setFormData({
      ...formData,
      demographics: { ...formData.demographics, interests },
    });
  };

  const handleCampaignChange = (field: string, value: string | string[]) => {
    setFormData({
      ...formData,
      campaign: { ...formData.campaign, [field]: value },
    });
  };

  const handleTrendsChange = (trend: string) => {
    const trends = formData.trends.includes(trend)
      ? formData.trends.filter((t) => t !== trend)
      : [...formData.trends, trend];
    setFormData({ ...formData, trends });
  };

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 0:
        return formData.industry !== '';
      case 1:
        return (
          formData.demographics.ageRange !== '' &&
          formData.demographics.interests.length > 0
        );
      case 2:
        return (
          formData.campaign.contentFocus !== '' &&
          formData.campaign.goals.length > 0
        );
      case 3:
        return formData.trends.length > 0;
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');
    setRecommendations('');
    
    try {
      const result = await generateRecommendations(formData);
      setRecommendations(result);
    } catch (err) {
      setError(err instanceof APIError ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Mail className="w-10 h-10 text-blue-600 mr-2" />
            <Sparkles className="w-6 h-6 text-yellow-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Discover Profitable Email Marketing Niches
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Answer a few questions, get AI-driven niche insights, and start creating
            targeted campaigns for your audience.
          </p>
        </header>

        <StepIndicator currentStep={currentStep} totalSteps={4} />

        {currentStep === 0 && (
          <FormStep
            title="Select Your Industry"
            description="Choose the industry you're interested in for email marketing"
          >
            <div className="space-y-4">
              <select
                className="input-field"
                value={formData.industry}
                onChange={handleIndustryChange}
              >
                <option value="">Select an industry</option>
                <option value="technology">Technology</option>
                <option value="finance">Finance</option>
                <option value="health">Health & Wellness</option>
                <option value="education">Education</option>
                <option value="ecommerce">E-commerce</option>
              </select>
              <div className="flex justify-end mt-6">
                <Button onClick={handleNext} disabled={!isStepValid()}>
                  Next Step
                </Button>
              </div>
            </div>
          </FormStep>
        )}

        {currentStep === 1 && (
          <FormStep
            title="Audience Demographics"
            description="Define your target audience characteristics"
          >
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age Range
                </label>
                <select
                  className="input-field"
                  value={formData.demographics.ageRange}
                  onChange={(e) => handleDemographicsChange('ageRange', e.target.value)}
                >
                  <option value="">Select age range</option>
                  <option value="18-24">18-24</option>
                  <option value="25-34">25-34</option>
                  <option value="35-44">35-44</option>
                  <option value="45-54">45-54</option>
                  <option value="55+">55+</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location (Optional)
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g., North America, Europe"
                  value={formData.demographics.location}
                  onChange={(e) => handleDemographicsChange('location', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interests (Select at least one)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['Technology', 'Business', 'Lifestyle', 'Entertainment', 'Sports', 'Education'].map((interest) => (
                    <label
                      key={interest}
                      className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        checked={formData.demographics.interests.includes(interest)}
                        onChange={() => handleInterestsChange(interest)}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span>{interest}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <Button variant="secondary" onClick={handleBack}>
                  Back
                </Button>
                <Button onClick={handleNext} disabled={!isStepValid()}>
                  Next Step
                </Button>
              </div>
            </div>
          </FormStep>
        )}

        {currentStep === 2 && (
          <FormStep
            title="Campaign Focus & Goals"
            description="Define your content strategy and campaign objectives"
          >
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content Focus
                </label>
                <select
                  className="input-field"
                  value={formData.campaign.contentFocus}
                  onChange={(e) => handleCampaignChange('contentFocus', e.target.value)}
                >
                  <option value="">Select content focus</option>
                  <option value="educational">Educational</option>
                  <option value="promotional">Promotional</option>
                  <option value="informational">Informational</option>
                  <option value="entertainment">Entertainment</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Campaign Goals (Select all that apply)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['Lead Generation', 'Brand Awareness', 'Sales', 'Customer Retention'].map((goal) => (
                    <label
                      key={goal}
                      className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                    >
                      <input
                        type="checkbox"
                        checked={formData.campaign.goals.includes(goal)}
                        onChange={() => {
                          const goals = formData.campaign.goals.includes(goal)
                            ? formData.campaign.goals.filter((g) => g !== goal)
                            : [...formData.campaign.goals, goal];
                          handleCampaignChange('goals', goals);
                        }}
                        className="rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span>{goal}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <Button variant="secondary" onClick={handleBack}>
                  Back
                </Button>
                <Button onClick={handleNext} disabled={!isStepValid()}>
                  Next Step
                </Button>
              </div>
            </div>
          </FormStep>
        )}

        {currentStep === 3 && (
          <FormStep
            title="Trending Topics"
            description="Select topics currently trending in your industry"
          >
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-3">
                {['Remote Work', 'AI & Automation', 'Sustainability', 'Digital Transformation', 'Mental Health', 'Personal Development'].map((trend) => (
                  <label
                    key={trend}
                    className="flex items-center space-x-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={formData.trends.includes(trend)}
                      onChange={() => handleTrendsChange(trend)}
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span>{trend}</span>
                  </label>
                ))}
              </div>

              <div className="flex justify-between mt-6">
                <Button variant="secondary" onClick={handleBack}>
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!isStepValid()}
                  isLoading={isLoading}
                >
                  Generate Recommendations
                </Button>
              </div>

              {error && (
                <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              {recommendations && (
                <div className="mt-8 p-6 bg-white rounded-lg shadow-lg">
                  <h3 className="text-xl font-semibold mb-4">Your Personalized Recommendations</h3>
                  <div className="prose max-w-none">
                    {recommendations.split('\n').map((line, index) => (
                      <p key={index}>{line}</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </FormStep>
        )}
      </div>
    </div>
  );
}

export default App;