import {
  destinations as defaultDestinations,
  packages as defaultPackages,
  hotels as defaultHotels,
  flightRoutes as defaultFlights,
  stats as defaultStats,
  testimonials as defaultTestimonials,
  homeShortcuts as defaultHomeShortcuts,
} from "@/lib/data";
import { SERVICE_CATEGORIES as defaultServices } from "@/lib/config/services";
import { COUNTRIES as defaultCountries } from "@/lib/config/countries";
import { VISA_DATABASE } from "@/lib/visa-database";

const isClient = typeof window !== "undefined";

const initialDb: Record<string, any> = {
  currentUser: null,
  users: [
    { id: "USR-001", name: "Super Administrator", email: "superadmin@cairohangzhou.com", role: "role-superadmin", status: "active", joinedDate: "Jan 2025" },
    { id: "USR-002", name: "Admin Assistant", email: "admin@cairohangzhou.com", role: "role-admin", status: "active", joinedDate: "Feb 2025" },
    { id: "USR-003", name: "Regional Manager", email: "manager@cairohangzhou.com", role: "role-manager", status: "active", joinedDate: "Mar 2025" },
    { id: "USR-004", name: "Visa Clerk", email: "employee@cairohangzhou.com", role: "role-employee", status: "active", joinedDate: "Apr 2025" },
    { id: "USR-005", name: "Ahmed Al-Hassan", email: "customer@cairohangzhou.com", role: "role-customer", status: "active", joinedDate: "May 2025" },
  ],
  visaApplications: [
    {
      id: "APP-001",
      userId: "USR-005",
      userName: "Ahmed Al-Hassan",
      userEmail: "customer@cairohangzhou.com",
      countryCode: "CN",
      visaTypeId: "CN::tourist",
      status: "pending",
      submissionDate: "2026-07-01",
      assignedTo: "USR-004",
      assignedName: "Visa Clerk",
      notes: [],
      documents: {
        passport: { name: "passport_copy.pdf", url: "#", uploadedAt: "2026-07-01" },
        photo: { name: "photo.jpg", url: "#", uploadedAt: "2026-07-01" }
      }
    }
  ],
  travelRequests: [
    {
      id: "REQ-001",
      customerName: "Ahmed Al-Hassan",
      email: "customer@cairohangzhou.com",
      phone: "+20 100 123 4567",
      type: "package",
      title: "Pharaoh's Legacy",
      details: "Booked for 2 passengers. Date: 2026-08-15.",
      amount: 5780,
      status: "pending",
      createdAt: "2026-07-02T10:00:00.000Z",
      assignedTo: "USR-003",
      assignedName: "Regional Manager",
      notes: [],
    }
  ],
  activityLogs: [
    { id: "log-1", text: "Ahmed Al-Hassan submitted request REQ-001", timestamp: "2026-07-02T10:00:00.000Z" }
  ],
  emailLogs: [
    { id: "email-1", to: "customer@cairohangzhou.com", subject: "Request Received", body: "We received your request.", timestamp: "2026-07-02T10:00:05.000Z" }
  ],
  visaRequirementsRegistry: JSON.parse(JSON.stringify(VISA_DATABASE)),
  faqs: [
    {
      id: "visa-processing-time",
      question: "How long does visa processing take?",
      answer: "Processing time depends on the destination and visa type. Most supported tourist visas take between 3 and 15 business days.",
      category: "Visa",
      published: true,
    },
    {
      id: "custom-packages",
      question: "Can Cairo Hangzhou build a custom travel package?",
      answer: "Yes. Advisors can build custom flights, hotels, transfers, tours, and visa support for individual travelers, families, and companies.",
      category: "Packages",
      published: true,
    },
  ],
  blogs: [
    {
      id: "post-schengen-guide",
      title: "Schengen Visa Guide: 10 Common Mistakes to Avoid",
      slug: "post-schengen-guide",
      excerpt: "A practical checklist for preparing complete visa applications.",
      body: "Keep passport validity, proof of funds, accommodation, flight itinerary, travel insurance, and employment or enrollment evidence ready before applying.",
      published: true,
      publishedAt: "2026-01-01T00:00:00.000Z",
    },
  ],
  destinations: defaultDestinations,
  packages: defaultPackages,
  hotels: defaultHotels,
  flights: defaultFlights,
  stats: defaultStats,
  testimonials: defaultTestimonials,
  shortcuts: defaultHomeShortcuts,
  services: defaultServices,
  countries: defaultCountries,
};

// In-memory cache for SSR/non-client runs
const memoryDb: Record<string, any> = { ...initialDb };

// Ensure localStorage matches initial values if not set
if (isClient) {
  Object.keys(initialDb).forEach((key) => {
    if (!localStorage.getItem(`mock_db_${key}`)) {
      localStorage.setItem(`mock_db_${key}`, JSON.stringify(initialDb[key]));
    }
  });
}

export function getDbItem<T>(key: string): T {
  if (isClient) {
    const data = localStorage.getItem(`mock_db_${key}`);
    if (data) {
      try {
        return JSON.parse(data) as T;
      } catch (e) {
        // Fallback
      }
    }
  }
  return memoryDb[key] as T;
}

export function setDbItem<T>(key: string, value: T): void {
  memoryDb[key] = value;
  if (isClient) {
    localStorage.setItem(`mock_db_${key}`, JSON.stringify(value));
  }
}
