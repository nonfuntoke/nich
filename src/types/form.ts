export interface FormData {
  industry: string;
  demographics: {
    ageRange: string;
    location: string;
    interests: string[];
  };
  campaign: {
    contentFocus: string;
    goals: string[];
  };
  trends: string[];
}

export const initialFormData: FormData = {
  industry: '',
  demographics: {
    ageRange: '',
    location: '',
    interests: [],
  },
  campaign: {
    contentFocus: '',
    goals: [],
  },
  trends: [],
};