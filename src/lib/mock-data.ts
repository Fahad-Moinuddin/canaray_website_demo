import type {
  ActivityItem,
  Appointment,
  CaseRecord,
  ChatMessage,
  Conversation,
  DemoUser,
  Indication,
  Location,
  Patient,
  Report,
  Service,
  TimeSlot,
} from "./types";

export const DEMO_USERS: DemoUser[] = [
  {
    id: "u-dentist",
    name: "Dr. Sarah Chen",
    role: "dentist",
    title: "General Dentist",
    practice: "Harbourview Dental",
    email: "schen@harbourview.demo",
    initials: "SC",
  },
  {
    id: "u-office",
    name: "Maya Torres",
    role: "office",
    title: "Office Coordinator",
    practice: "Harbourview Dental",
    email: "mtores@harbourview.demo",
    initials: "MT",
  },
  {
    id: "u-patient",
    name: "James Okonkwo",
    role: "patient",
    title: "Patient",
    practice: "",
    email: "james.okonkwo@email.demo",
    initials: "JO",
  },
  {
    id: "u-staff",
    name: "Priya Nair",
    role: "staff",
    title: "Canaray Client Success",
    practice: "Canaray",
    email: "priya.nair@canaray.demo",
    initials: "PN",
  },
];

export const LOCATIONS: Location[] = [
  {
    id: "loc-yorkville",
    name: "Canaray Yorkville",
    address: "120 Bloor Street West, Suite 400",
    city: "Toronto, ON",
    hours: "Mon–Fri 8:00–18:00",
  },
  {
    id: "loc-northyork",
    name: "Canaray North York",
    address: "4800 Yonge Street, Suite 210",
    city: "Toronto, ON",
    hours: "Mon–Fri 8:30–17:30",
  },
  {
    id: "loc-mississauga",
    name: "Canaray Mississauga",
    address: "55 City Centre Drive, Suite 120",
    city: "Mississauga, ON",
    hours: "Mon–Thu 8:00–18:00 · Fri 8:00–16:00",
  },
];

export const SERVICES: Service[] = [
  {
    id: "svc-cbct-endo",
    name: "CBCT — Endodontics",
    category: "cbct",
    shortDescription: "High-resolution imaging for tooth pain and root canal planning.",
    whyChoose: "See canals, fractures, and periapical pathology in 3D before treatment.",
    typicalDuration: "20–30 min",
    basePrice: 285,
  },
  {
    id: "svc-cbct-impacted",
    name: "CBCT — Impacted / Wisdom Tooth",
    category: "cbct",
    shortDescription: "Map proximity to nerves and sinus before extraction.",
    whyChoose: "Reduce surgical risk with clear nerve and root relationship views.",
    typicalDuration: "20–30 min",
    basePrice: 295,
  },
  {
    id: "svc-cbct-implant",
    name: "CBCT — Implant Planning",
    category: "cbct",
    shortDescription: "Bone volume, density, and anatomy for implant placement.",
    whyChoose: "Plan implant position with confidence and optional surgical guide.",
    typicalDuration: "25–35 min",
    basePrice: 325,
  },
  {
    id: "svc-cbct-ortho",
    name: "CBCT — Orthognathic Surgery",
    category: "cbct",
    shortDescription: "Full jaw relationship imaging for surgical orthodontics.",
    whyChoose: "Precise skeletal assessment for surgical treatment planning.",
    typicalDuration: "30–40 min",
    basePrice: 375,
  },
  {
    id: "svc-cbct-tmj",
    name: "CBCT — TMJ",
    category: "cbct",
    shortDescription: "Joint morphology and bony changes for TMJ evaluation.",
    whyChoose: "Document osseous TMJ findings to support diagnosis and referral.",
    typicalDuration: "25–35 min",
    basePrice: 310,
  },
  {
    id: "svc-cbct-path",
    name: "CBCT — Bone Pathology",
    category: "cbct",
    shortDescription: "Evaluate lesions, expansile processes, and bony anomalies.",
    whyChoose: "Detailed 3D characterization for diagnosis and monitoring.",
    typicalDuration: "25–35 min",
    basePrice: 340,
  },
  {
    id: "svc-pano",
    name: "Panoramic Radiograph",
    category: "other",
    shortDescription: "Full-arch overview for screening and treatment planning.",
    whyChoose: "Fast, low-dose overview of dentition and supporting structures.",
    typicalDuration: "10–15 min",
    basePrice: 95,
  },
  {
    id: "svc-ceph",
    name: "Cephalometric Radiograph",
    category: "other",
    shortDescription: "Lateral skull imaging for orthodontic analysis.",
    whyChoose: "Standard cephalometric tracing and growth assessment.",
    typicalDuration: "10–15 min",
    basePrice: 110,
  },
  {
    id: "svc-photos",
    name: "Clinical Photographs",
    category: "other",
    shortDescription: "Standardized intraoral and extraoral photo sets.",
    whyChoose: "Consistent documentation for ortho, restorative, and records.",
    typicalDuration: "15–20 min",
    basePrice: 85,
  },
  {
    id: "svc-impressions",
    name: "Digital Impressions",
    category: "other",
    shortDescription: "Intraoral scans for models, appliances, and guides.",
    whyChoose: "Accurate digital models without traditional impressions.",
    typicalDuration: "20–30 min",
    basePrice: 175,
  },
  {
    id: "svc-guide",
    name: "Surgical Guide",
    category: "other",
    shortDescription: "Implant surgical guide fabrication from CBCT + scan.",
    whyChoose: "Translate digital implant plans into precise chairside guidance.",
    typicalDuration: "Consultation + lab",
    basePrice: 450,
  },
  {
    id: "svc-id-photo",
    name: "Identification Photo",
    category: "other",
    shortDescription: "Patient identification photograph for records.",
    whyChoose: "Quick identity documentation for chart and consent workflows.",
    typicalDuration: "5 min",
    basePrice: 25,
  },
];

export const INDICATIONS: Indication[] = [
  {
    id: "ind-endo-pain",
    serviceId: "svc-cbct-endo",
    label: "Persistent tooth pain",
    description: "Unexplained or unresolved pain after clinical exam.",
  },
  {
    id: "ind-endo-rct",
    serviceId: "svc-cbct-endo",
    label: "Root canal planning",
    description: "Canal morphology and periapical status before endo.",
  },
  {
    id: "ind-endo-fracture",
    serviceId: "svc-cbct-endo",
    label: "Suspected fracture",
    description: "Evaluate for vertical root or crown fracture.",
  },
  {
    id: "ind-imp-extract",
    serviceId: "svc-cbct-impacted",
    label: "Pre-extraction assessment",
    description: "Nerve proximity and root orientation.",
  },
  {
    id: "ind-imp-path",
    serviceId: "svc-cbct-impacted",
    label: "Associated pathology",
    description: "Cyst, resorption, or pericoronal findings.",
  },
  {
    id: "ind-implant-single",
    serviceId: "svc-cbct-implant",
    label: "Single implant site",
    description: "Bone height/width for one planned implant.",
  },
  {
    id: "ind-implant-multi",
    serviceId: "svc-cbct-implant",
    label: "Multiple implant sites",
    description: "Full-arch or multi-site implant planning.",
  },
  {
    id: "ind-implant-graft",
    serviceId: "svc-cbct-implant",
    label: "Graft / sinus evaluation",
    description: "Assess residual bone and sinus anatomy.",
  },
  {
    id: "ind-ortho-plan",
    serviceId: "svc-cbct-ortho",
    label: "Surgical orthodontic planning",
    description: "Skeletal relationships for orthognathic surgery.",
  },
  {
    id: "ind-tmj-pain",
    serviceId: "svc-cbct-tmj",
    label: "TMJ pain / dysfunction",
    description: "Bony joint assessment for TMJ symptoms.",
  },
  {
    id: "ind-path-lesion",
    serviceId: "svc-cbct-path",
    label: "Suspected lesion",
    description: "Characterize radiolucent or radiopaque finding.",
  },
];

export const PATIENTS: Patient[] = [
  {
    id: "pt-001",
    firstName: "Elena",
    lastName: "Vasquez",
    dateOfBirth: "1987-03-14",
    phone: "(416) 555-0142",
    email: "elena.vasquez@email.demo",
    chartNumber: "HV-10482",
  },
  {
    id: "pt-002",
    firstName: "Marcus",
    lastName: "Nguyen",
    dateOfBirth: "1994-11-02",
    phone: "(416) 555-0198",
    email: "marcus.nguyen@email.demo",
    chartNumber: "HV-11037",
  },
  {
    id: "pt-003",
    firstName: "Aisha",
    lastName: "Rahman",
    dateOfBirth: "1979-07-22",
    phone: "(647) 555-0133",
    email: "aisha.rahman@email.demo",
    chartNumber: "HV-09821",
  },
  {
    id: "pt-004",
    firstName: "Daniel",
    lastName: "Park",
    dateOfBirth: "2001-01-18",
    phone: "(905) 555-0176",
    email: "daniel.park@email.demo",
    chartNumber: "HV-12104",
  },
  {
    id: "pt-005",
    firstName: "Sofia",
    lastName: "Martinez",
    dateOfBirth: "1968-09-05",
    phone: "(416) 555-0111",
    email: "sofia.martinez@email.demo",
    chartNumber: "HV-08755",
  },
  {
    id: "pt-006",
    firstName: "James",
    lastName: "Okonkwo",
    dateOfBirth: "1990-05-29",
    phone: "(647) 555-0188",
    email: "james.okonkwo@email.demo",
    chartNumber: "HV-11590",
  },
];

export const APPOINTMENTS: Appointment[] = [
  {
    id: "appt-001",
    patientId: "pt-001",
    serviceId: "svc-cbct-implant",
    indicationId: "ind-implant-single",
    locationId: "loc-yorkville",
    datetime: "2026-09-12T10:30:00",
    status: "upcoming",
    price: 325,
  },
  {
    id: "appt-002",
    patientId: "pt-002",
    serviceId: "svc-cbct-endo",
    indicationId: "ind-endo-pain",
    locationId: "loc-northyork",
    datetime: "2026-09-15T14:00:00",
    status: "upcoming",
    price: 285,
  },
  {
    id: "appt-003",
    patientId: "pt-004",
    serviceId: "svc-pano",
    locationId: "loc-mississauga",
    datetime: "2026-09-18T09:15:00",
    status: "upcoming",
    price: 95,
  },
  {
    id: "appt-004",
    patientId: "pt-003",
    serviceId: "svc-cbct-impacted",
    indicationId: "ind-imp-extract",
    locationId: "loc-yorkville",
    datetime: "2026-08-28T11:00:00",
    status: "completed",
    price: 295,
  },
  {
    id: "appt-005",
    patientId: "pt-005",
    serviceId: "svc-cbct-tmj",
    indicationId: "ind-tmj-pain",
    locationId: "loc-yorkville",
    datetime: "2026-08-20T15:30:00",
    status: "completed",
    price: 310,
  },
];

export const CASES: CaseRecord[] = [
  {
    id: "case-001",
    patientId: "pt-003",
    serviceId: "svc-cbct-impacted",
    indicationId: "ind-imp-extract",
    locationId: "loc-yorkville",
    appointmentId: "appt-004",
    status: "ready",
    createdAt: "2026-08-28T11:45:00",
    updatedAt: "2026-08-29T09:20:00",
    reportId: "rpt-001",
    has3D: true,
    imageCount: 12,
    documentCount: 2,
  },
  {
    id: "case-002",
    patientId: "pt-005",
    serviceId: "svc-cbct-tmj",
    indicationId: "ind-tmj-pain",
    locationId: "loc-yorkville",
    appointmentId: "appt-005",
    status: "ready",
    createdAt: "2026-08-20T16:00:00",
    updatedAt: "2026-08-21T10:15:00",
    reportId: "rpt-002",
    has3D: true,
    imageCount: 8,
    documentCount: 1,
  },
  {
    id: "case-003",
    patientId: "pt-001",
    serviceId: "svc-cbct-implant",
    indicationId: "ind-implant-single",
    locationId: "loc-yorkville",
    appointmentId: "appt-001",
    status: "scheduled",
    createdAt: "2026-09-08T09:00:00",
    updatedAt: "2026-09-08T09:00:00",
    has3D: false,
    imageCount: 0,
    documentCount: 1,
  },
  {
    id: "case-004",
    patientId: "pt-002",
    serviceId: "svc-cbct-endo",
    indicationId: "ind-endo-pain",
    locationId: "loc-northyork",
    appointmentId: "appt-002",
    status: "scheduled",
    createdAt: "2026-09-09T13:30:00",
    updatedAt: "2026-09-09T13:30:00",
    has3D: false,
    imageCount: 0,
    documentCount: 0,
  },
];

export const REPORTS: Report[] = [
  {
    id: "rpt-001",
    caseId: "case-001",
    title: "CBCT Report — Mandibular Third Molar Assessment",
    radiologist: "Dr. Amira Hassan, DMD, FRCD(C)",
    completedAt: "2026-08-29T09:20:00",
    summary:
      "High-resolution CBCT of the mandible demonstrates a horizontally impacted mandibular left third molar with close proximity to the inferior alveolar canal.",
    findings: [
      "Tooth 38 is horizontally impacted with incomplete root formation.",
      "The inferior alveolar canal courses immediately buccal to the apical third of the mesial root.",
      "Mild follicular enlargement measuring approximately 3 mm is noted.",
      "No radiographic evidence of external root resorption of tooth 37.",
      "Cortical plates remain intact with no expansile lesion identified.",
    ],
    impression:
      "Horizontally impacted tooth 38 with intimate relationship to the IAN canal. Surgical planning should account for elevated risk of nerve injury.",
    recommendations: [
      "Correlate clinically prior to extraction.",
      "Consider surgical referral given canal proximity.",
      "Interactive 3D volume available for surgical planning.",
    ],
  },
  {
    id: "rpt-002",
    caseId: "case-002",
    title: "CBCT Report — Bilateral TMJ Evaluation",
    radiologist: "Dr. Liam O'Brien, DDS, FRCD(C)",
    completedAt: "2026-08-21T10:15:00",
    summary:
      "Bilateral TMJ CBCT demonstrates mild degenerative remodeling of the right condyle with preserved joint spaces.",
    findings: [
      "Right condyle shows flattening of the superior articular surface with small osteophyte formation.",
      "Left condyle morphology is within normal limits for age.",
      "Joint spaces are maintained bilaterally with no ankylosis.",
      "No acute fracture or aggressive osseous lesion identified.",
    ],
    impression:
      "Mild degenerative joint disease, right TMJ. Left TMJ within normal radiographic limits.",
    recommendations: [
      "Correlate with clinical symptoms and occlusion.",
      "Conservative management may be appropriate if symptoms are mild.",
      "Repeat imaging only if clinical change warrants.",
    ],
  },
];

export const ACTIVITY: ActivityItem[] = [
  {
    id: "act-001",
    caseId: "case-001",
    label: "Report ready",
    detail: "Aisha Rahman — impacted third molar CBCT",
    timestamp: "2026-08-29T09:20:00",
    type: "report",
  },
  {
    id: "act-002",
    caseId: "case-002",
    label: "Report ready",
    detail: "Sofia Martinez — TMJ CBCT",
    timestamp: "2026-08-21T10:15:00",
    type: "report",
  },
  {
    id: "act-003",
    label: "Appointment booked",
    detail: "Elena Vasquez — implant planning CBCT",
    timestamp: "2026-09-08T09:00:00",
    type: "appointment",
  },
  {
    id: "act-004",
    label: "Message from Canaray",
    detail: "Guide scan requirements for implant case",
    timestamp: "2026-09-10T11:42:00",
    type: "message",
  },
  {
    id: "act-005",
    label: "Referral submitted",
    detail: "Marcus Nguyen — endodontic CBCT",
    timestamp: "2026-09-09T13:30:00",
    type: "referral",
  },
];

export const CONVERSATIONS: Conversation[] = [
  {
    id: "conv-001",
    title: "Aisha Rahman — Case case-001",
    caseId: "case-001",
    participants: ["Dr. Sarah Chen", "Canaray Imaging"],
    lastMessageAt: "2026-09-10T11:42:00",
    unread: 1,
  },
  {
    id: "conv-002",
    title: "Harbourview Dental — General",
    participants: ["Maya Torres", "Canaray Client Success"],
    lastMessageAt: "2026-09-08T16:05:00",
    unread: 0,
  },
  {
    id: "conv-003",
    title: "Sofia Martinez — TMJ follow-up",
    caseId: "case-002",
    participants: ["Dr. Sarah Chen", "Dr. Liam O'Brien"],
    lastMessageAt: "2026-08-22T09:18:00",
    unread: 0,
  },
];

export const MESSAGES: ChatMessage[] = [
  {
    id: "msg-001",
    conversationId: "conv-001",
    sender: "Canaray Imaging",
    senderRole: "canaray",
    body: "Report for Aisha Rahman is ready. 3D volume is available in the case viewer.",
    timestamp: "2026-08-29T09:25:00",
  },
  {
    id: "msg-002",
    conversationId: "conv-001",
    sender: "Dr. Sarah Chen",
    senderRole: "dentist",
    body: "Thank you — reviewing now. Could you confirm nerve canal proximity on the mesial root?",
    timestamp: "2026-08-29T10:02:00",
  },
  {
    id: "msg-003",
    conversationId: "conv-001",
    sender: "Canaray Imaging",
    senderRole: "canaray",
    body: "Confirmed in findings #2. The interactive 3D view highlights the canal in the axial and reconstructed panoramic planes.",
    timestamp: "2026-08-29T10:18:00",
  },
  {
    id: "msg-004",
    conversationId: "conv-001",
    sender: "Canaray Imaging",
    senderRole: "canaray",
    body: "If you are preparing a surgical guide for a related implant site, please upload the intraoral scan here.",
    timestamp: "2026-09-10T11:42:00",
  },
  {
    id: "msg-005",
    conversationId: "conv-002",
    sender: "Maya Torres",
    senderRole: "office",
    body: "Hi — can we update Elena Vasquez's preferred contact number before Friday?",
    timestamp: "2026-09-08T15:50:00",
  },
  {
    id: "msg-006",
    conversationId: "conv-002",
    sender: "Canaray Client Success",
    senderRole: "canaray",
    body: "Absolutely. Reply with the new number and we will update the appointment confirmation.",
    timestamp: "2026-09-08T16:05:00",
  },
  {
    id: "msg-007",
    conversationId: "conv-003",
    sender: "Dr. Sarah Chen",
    senderRole: "dentist",
    body: "Patient reports improved comfort after conservative management. No further imaging needed for now.",
    timestamp: "2026-08-22T09:18:00",
  },
];

/** Generate mock availability for the next 10 business days */
export function getAvailableSlots(locationId: string): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const start = new Date("2026-09-14T00:00:00");
  let dayOffset = 0;
  let id = 0;

  while (slots.length < 24) {
    const day = new Date(start);
    day.setDate(start.getDate() + dayOffset);
    const dow = day.getDay();
    if (dow !== 0 && dow !== 6) {
      for (const hour of [9, 10, 11, 13, 14, 15, 16]) {
        if (slots.length >= 24) break;
        const dt = new Date(day);
        dt.setHours(hour, hour === 11 ? 30 : 0, 0, 0);
        // Deterministic unavailability for demo
        const unavailable =
          (locationId === "loc-yorkville" && hour === 11) ||
          (locationId === "loc-northyork" && hour === 14) ||
          (dayOffset === 2 && hour === 10);
        slots.push({
          id: `slot-${locationId}-${id++}`,
          datetime: dt.toISOString(),
          available: !unavailable,
        });
      }
    }
    dayOffset += 1;
    if (dayOffset > 20) break;
  }
  return slots;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(iso: string, opts?: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat(
    "en-CA",
    opts ?? { weekday: "short", month: "short", day: "numeric", year: "numeric" },
  ).format(new Date(iso));
}

export function formatTime(iso: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function formatDateTime(iso: string): string {
  return `${formatDate(iso)} · ${formatTime(iso)}`;
}

export function patientName(patient: Patient): string {
  return `${patient.firstName} ${patient.lastName}`;
}

export function getPatient(id: string) {
  return PATIENTS.find((p) => p.id === id);
}

export function getService(id: string) {
  return SERVICES.find((s) => s.id === id);
}

export function getLocation(id: string) {
  return LOCATIONS.find((l) => l.id === id);
}

export function getCase(id: string) {
  return CASES.find((c) => c.id === id);
}

export function getReport(id: string) {
  return REPORTS.find((r) => r.id === id);
}

export function getIndication(id: string) {
  return INDICATIONS.find((i) => i.id === id);
}

export const STATUS_LABELS: Record<string, string> = {
  scheduled: "Scheduled",
  checked_in: "Checked in",
  imaging: "Imaging in progress",
  reporting: "Report in progress",
  ready: "Report ready",
  completed: "Completed",
  upcoming: "Upcoming",
  cancelled: "Cancelled",
  no_show: "No show",
};
