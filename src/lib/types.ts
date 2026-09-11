export type UserRole = "dentist" | "office" | "patient" | "staff";

export type CaseStatus =
  | "scheduled"
  | "checked_in"
  | "imaging"
  | "reporting"
  | "ready"
  | "completed";

export type AppointmentStatus = "upcoming" | "completed" | "cancelled" | "no_show";

export type MessageAttachmentStatus = "uploading" | "uploaded" | "failed";

export interface DemoUser {
  id: string;
  name: string;
  role: UserRole;
  title: string;
  practice: string;
  email: string;
  initials: string;
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phone: string;
  email: string;
  chartNumber: string;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  hours: string;
}

export interface Service {
  id: string;
  name: string;
  category: "cbct" | "other";
  shortDescription: string;
  whyChoose: string;
  typicalDuration: string;
  basePrice: number;
}

export interface Indication {
  id: string;
  serviceId: string;
  label: string;
  description: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  serviceId: string;
  indicationId?: string;
  locationId: string;
  datetime: string;
  status: AppointmentStatus;
  price: number;
}

export interface Report {
  id: string;
  caseId: string;
  title: string;
  radiologist: string;
  completedAt: string;
  summary: string;
  findings: string[];
  impression: string;
  recommendations: string[];
}

export interface CaseRecord {
  id: string;
  patientId: string;
  serviceId: string;
  indicationId?: string;
  locationId: string;
  appointmentId: string;
  status: CaseStatus;
  createdAt: string;
  updatedAt: string;
  reportId?: string;
  has3D: boolean;
  imageCount: number;
  documentCount: number;
}

export interface ActivityItem {
  id: string;
  caseId?: string;
  label: string;
  detail: string;
  timestamp: string;
  type: "report" | "appointment" | "message" | "upload" | "referral";
}

export interface Conversation {
  id: string;
  title: string;
  caseId?: string;
  participants: string[];
  lastMessageAt: string;
  unread: number;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  sender: string;
  senderRole: "office" | "canaray" | "dentist";
  body: string;
  timestamp: string;
  attachment?: {
    name: string;
    sizeLabel: string;
    status: MessageAttachmentStatus;
    progress?: number;
  };
}

export interface TimeSlot {
  id: string;
  datetime: string;
  available: boolean;
}

export interface ReferralDraft {
  patientId: string | null;
  newPatient?: Partial<Patient>;
  serviceId: string | null;
  indicationId: string | null;
  locationId: string | null;
  slotId: string | null;
  notes: string;
  step: number;
}

export interface BookingDraft {
  patientId: string | null;
  serviceId: string | null;
  locationId: string | null;
  slotId: string | null;
  step: number;
}
