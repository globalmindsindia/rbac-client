export interface AppFormData {
  name: string;
  email: string;
  phone: string;
  country: string;
  university: string;
  course: string;
  resume: File | null;
  preffered_length: string; // keep current name to avoid refactor
  specific_requirements: string; // keep current name to avoid refactor
  answers?: Record<string, string>; // <- add this, remove the index signature
}
