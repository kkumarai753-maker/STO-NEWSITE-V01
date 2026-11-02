import { serviceCategories } from "@/data/service-categories";
export const officeMode = "Work from Office";
export const officeLocation = "Nagpur, Maharashtra, India";
export const hiringStatuses = [
  "Received",
  "Reviewing",
  "Shortlisted",
  "Interview",
  "Selected",
  "Not Selected",
  "Withdrawn",
] as const;
export type CareerRole = {
  id: string;
  slug: string;
  status: "Draft" | "Open" | "Closed";
  title: string;
  category: string;
  function: "Sales" | "Operations" | "Development" | "Marketing";
  headline: string;
  summary: string;
  responsibilities: string[];
  skills: string[];
  work_samples: string;
  image: string;
  display_order: number;
  visual_note?: string;
};
export type CareersData = {
  roles: CareerRole[];
  applications_enabled: boolean;
  email_enabled: boolean;
  retention_days: number | null;
  available: boolean;
};
export type CareerApplication = {
  id: string;
  role_id: string | null;
  role_title: string;
  category: string;
  kind: "role" | "general";
  candidate: {
    name: string;
    email: string;
    phone: string;
    city: string;
    experience: number;
    portfolio: string;
    availability: string;
    introduction: string;
    office_acknowledged: boolean;
    consent: boolean;
    privacy_version: string;
  };
  status: string;
  notes: string;
  route: string;
  email_status: string;
  has_resume: boolean;
  created_at: string;
  consent_at: string;
  expires_at: string;
  whatsapp_handoff_at: string | null;
  email_attempt_at: string | null;
};
export const categoryName = (id: string) =>
  serviceCategories.find((c) => c.id === id)?.name ?? id;
export const careerArtwork = (role: Pick<CareerRole, "function" | "image">) =>
  role.image || `/careers/${role.function.toLowerCase()}.svg`;
