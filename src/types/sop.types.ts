export interface AppFormData {
  name: string;
  email: string;
  phone: string;
  country: string;
  university: string;
  course: string;
  resume: File | null;
  preffered_length: string;
  specific_requirements: string;

  // allow dynamic keys for Questionnaire
  [key: string]: string | File | null;
}
