"use client";

export type RequestType = "visa" | "flight" | "hotel" | "package" | "custom";
export type RequestStatus = "Pending" | "Under Review" | "Documents Required" | "Approved" | "Rejected" | "Completed";

export interface TravelRequest {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  type: RequestType;
  title: string;
  details: string;
  status: RequestStatus;
  amount: number;
  assignedTo: string;
  createdTime: string;
  documents: { name: string; size: string }[];
  internalNotes: { id: string; author: string; content: string; time: string }[];
}

export interface AdminNotification {
  id: string;
  message: string;
  read: boolean;
  time: string;
  link?: string;
}

export interface EmailLog {
  id: string;
  requestId: string;
  to: string;
  subject: string;
  body: string;
  sentTime: string;
  type: "company_notification" | "customer_confirmation" | "status_update";
}

export interface ActivityLog {
  id: string;
  requestId: string;
  action: string;
  details: string;
  actor: string;
  time: string;
}

// Initial seed data
const SEED_REQUESTS: TravelRequest[] = [
  {
    id: "REQ-0891",
    customerName: "Sarah Al-Mansouri",
    email: "sarah@example.com",
    phone: "+971 50 123 4567",
    type: "flight",
    title: "Cairo (CAI) → Dubai (DXB)",
    details: "Depart Date: Aug 15, 2026. Cabin: Business Class. Airline: Emirates EK924. Passengers: 1.",
    status: "Approved",
    amount: 49000,
    assignedTo: "Ahmed Youssef",
    createdTime: "2026-07-01T10:23:00Z",
    documents: [],
    internalNotes: [
      { id: "n1", author: "System", content: "Flight booking processed automatically via Emirates API gateway.", time: "2026-07-01T10:25:00Z" }
    ]
  },
  {
    id: "REQ-0890",
    customerName: "James Whitmore",
    email: "james.w@example.com",
    phone: "+44 7700 900077",
    type: "package",
    title: "Japan Sakura Trail — Tokyo & Kyoto",
    details: "Duration: 10 Days. Group Size: 2 People. Base Price: EGP 225,000. Expected date: Sep 2, 2026.",
    status: "Pending",
    amount: 225000,
    assignedTo: "Sarah Mansour",
    createdTime: "2026-07-02T14:05:00Z",
    documents: [],
    internalNotes: []
  },
  {
    id: "REQ-0889",
    customerName: "Dr. Fatima Al-Rashid",
    email: "fatima.r@example.com",
    phone: "+966 50 555 1234",
    type: "visa",
    title: "Schengen Area (Europe) Tourist Visa",
    details: "Visa Center: Cairo. Visa Type: Tourist. Continent: Europe. Intended departure: Aug 22, 2026.",
    status: "Under Review",
    amount: 4500,
    assignedTo: "Li Wei",
    createdTime: "2026-07-02T09:30:00Z",
    documents: [
      { name: "passport_scan.pdf", size: "1.4 MB" },
      { name: "flight_itinerary.pdf", size: "450 KB" },
      { name: "hotel_booking.pdf", size: "380 KB" },
      { name: "hr_letter.pdf", size: "780 KB" }
    ],
    internalNotes: [
      { id: "n2", author: "Li Wei", content: "HR letter looks authentic. Waiting for translation certification from the office.", time: "2026-07-02T11:00:00Z" }
    ]
  },
  {
    id: "REQ-0888",
    customerName: "Mohamed Karim",
    email: "mohamed.karim@email.com",
    phone: "+20 100 987 6543",
    type: "hotel",
    title: "Four Seasons Cairo",
    details: "Check-in: Aug 14, 2026. Check-out: Aug 18, 2026. Rooms: 1 Room. Nights: 4 Nights. Category: 5 Stars Ritual.",
    status: "Documents Required",
    amount: 84000,
    assignedTo: "Ahmed Youssef",
    createdTime: "2026-07-02T16:45:00Z",
    documents: [],
    internalNotes: [
      { id: "n3", author: "Ahmed Youssef", content: "Need passport scan and credit card pre-authorization form to confirm booking.", time: "2026-07-02T17:00:00Z" }
    ]
  }
];

const SEED_NOTIFICATIONS: AdminNotification[] = [
  { id: "notif-1", message: "New Visa Application submitted by Dr. Fatima Al-Rashid", read: false, time: "2026-07-02T09:30:00Z" },
  { id: "notif-2", message: "New Package Enquiry from James Whitmore", read: false, time: "2026-07-02T14:05:00Z" }
];

const SEED_EMAILS: EmailLog[] = [
  {
    id: "mail-1",
    requestId: "REQ-0891",
    to: "info@cairohangzhou.com",
    subject: "NEW FLIGHT BOOKING: Sarah Al-Mansouri (REQ-0891)",
    body: "A new flight booking request has been submitted by Sarah Al-Mansouri for Cairo (CAI) → Dubai (DXB).",
    sentTime: "2026-07-01T10:23:00Z",
    type: "company_notification"
  },
  {
    id: "mail-2",
    requestId: "REQ-0891",
    to: "sarah@example.com",
    subject: "Flight Request Received - REQ-0891",
    body: "Dear Sarah, we have received your booking request for Cairo (CAI) → Dubai (DXB). An advisor is processing it.",
    sentTime: "2026-07-01T10:23:05Z",
    type: "customer_confirmation"
  }
];

const SEED_ACTIVITY: ActivityLog[] = [
  { id: "act-1", requestId: "REQ-0891", action: "Created", details: "Request created from Flight Search page", actor: "Customer", time: "2026-07-01T10:23:00Z" },
  { id: "act-2", requestId: "REQ-0891", action: "Status Updated", details: "Status updated from Pending to Approved", actor: "Ahmed Youssef", time: "2026-07-01T10:25:00Z" }
];

// Helper to check for window definition
const isClient = () => typeof window !== "undefined";

export function loadData<T>(key: string, seed: T): T {
  if (!isClient()) return seed;
  const stored = localStorage.getItem(key);
  if (!stored) {
    localStorage.setItem(key, JSON.stringify(seed));
    return seed;
  }
  return JSON.parse(stored) as T;
}

export function saveData<T>(key: string, data: T) {
  if (isClient()) {
    localStorage.setItem(key, JSON.stringify(data));
  }
}

// Store CRUD handlers
export function getRequestsStore(): TravelRequest[] {
  return loadData<TravelRequest[]>("ch_requests", SEED_REQUESTS);
}

export function getNotificationsStore(): AdminNotification[] {
  return loadData<AdminNotification[]>("ch_notifications", SEED_NOTIFICATIONS);
}

export function getEmailLogsStore(): EmailLog[] {
  return loadData<EmailLog[]>("ch_emails", SEED_EMAILS);
}

export function getActivityLogsStore(): ActivityLog[] {
  return loadData<ActivityLog[]>("ch_activities", SEED_ACTIVITY);
}

export function submitRequest(req: {
  customerName: string;
  email: string;
  phone: string;
  type: RequestType;
  title: string;
  details: string;
  amount: number;
  documents?: { name: string; size: string }[];
}): TravelRequest {
  const requests = getRequestsStore();
  const nextNum = requests.length + 888;
  const newId = `REQ-0${nextNum}`;
  const now = new Date().toISOString();

  const newRequest: TravelRequest = {
    id: newId,
    customerName: req.customerName,
    email: req.email,
    phone: req.phone,
    type: req.type,
    title: req.title,
    details: req.details,
    status: "Pending",
    amount: req.amount,
    assignedTo: "",
    createdTime: now,
    documents: req.documents || [],
    internalNotes: [],
  };

  // Add Request
  requests.unshift(newRequest);
  saveData("ch_requests", requests);

  // Add Notification
  const notifications = getNotificationsStore();
  notifications.unshift({
    id: `notif-${Date.now()}`,
    message: `New ${req.type.toUpperCase()} Request from ${req.customerName} (${newId})`,
    read: false,
    time: now,
  });
  saveData("ch_notifications", notifications);

  // Add Emails
  const emails = getEmailLogsStore();
  const companyEmail: EmailLog = {
    id: `email-${Date.now()}-c`,
    requestId: newId,
    to: "info@cairohangzhou.com",
    subject: `NEW REQUEST: ${req.customerName} - ${newId}`,
    body: `A new ${req.type} request has been submitted for ${req.title}.\n\nClient: ${req.customerName}\nEmail: ${req.email}\nPhone: ${req.phone}\nDetails: ${req.details}`,
    sentTime: now,
    type: "company_notification",
  };
  const customerEmail: EmailLog = {
    id: `email-${Date.now()}-cust`,
    requestId: newId,
    to: req.email,
    subject: `Your Booking Request ${newId} Received`,
    body: `Dear ${req.customerName},\n\nWe have successfully received your travel booking request for ${req.title}.\nOur advisors will review the details and get back to you shortly.\n\nThank you for choosing Cairo Hangzhou.`,
    sentTime: now,
    type: "customer_confirmation",
  };
  emails.unshift(companyEmail, customerEmail);
  saveData("ch_emails", emails);

  // Add Activity
  const activities = getActivityLogsStore();
  activities.unshift({
    id: `act-${Date.now()}`,
    requestId: newId,
    action: "Created",
    details: `Request submitted via ${req.type} web portal`,
    actor: "Customer",
    time: now,
  });
  saveData("ch_activities", activities);

  return newRequest;
}

export function updateRequestStatus(id: string, status: RequestStatus, actor = "Admin"): TravelRequest | null {
  const requests = getRequestsStore();
  const idx = requests.findIndex((r) => r.id === id);
  if (idx === -1) return null;

  const req = requests[idx];
  const oldStatus = req.status;
  req.status = status;
  saveData("ch_requests", requests);

  const now = new Date().toISOString();

  // Log Activity
  const activities = getActivityLogsStore();
  activities.unshift({
    id: `act-${Date.now()}`,
    requestId: id,
    action: "Status Updated",
    details: `Status transitioned from ${oldStatus} to ${status}`,
    actor,
    time: now,
  });
  saveData("ch_activities", activities);

  // Log Status Email
  const emails = getEmailLogsStore();
  emails.unshift({
    id: `email-${Date.now()}`,
    requestId: id,
    to: req.email,
    subject: `Status Update for Booking ${id}: ${status}`,
    body: `Dear ${req.customerName},\n\nThe status of your booking request ${id} (${req.title}) has been updated to: ${status}.\n\nBest regards,\nCairo Hangzhou Operations`,
    sentTime: now,
    type: "status_update",
  });
  saveData("ch_emails", emails);

  return req;
}

export function assignRequest(id: string, employee: string, actor = "Admin"): TravelRequest | null {
  const requests = getRequestsStore();
  const idx = requests.findIndex((r) => r.id === id);
  if (idx === -1) return null;

  const req = requests[idx];
  const oldAssignee = req.assignedTo;
  req.assignedTo = employee;
  saveData("ch_requests", requests);

  const now = new Date().toISOString();

  // Log Activity
  const activities = getActivityLogsStore();
  activities.unshift({
    id: `act-${Date.now()}`,
    requestId: id,
    action: "Assigned",
    details: oldAssignee 
      ? `Reassigned from ${oldAssignee} to ${employee}` 
      : `Assigned to ${employee}`,
    actor,
    time: now,
  });
  saveData("ch_activities", activities);

  return req;
}

export function addInternalNote(id: string, content: string, author = "Admin"): TravelRequest | null {
  const requests = getRequestsStore();
  const idx = requests.findIndex((r) => r.id === id);
  if (idx === -1) return null;

  const req = requests[idx];
  req.internalNotes.unshift({
    id: `note-${Date.now()}`,
    author,
    content,
    time: new Date().toISOString(),
  });
  saveData("ch_requests", requests);

  const now = new Date().toISOString();

  // Log Activity
  const activities = getActivityLogsStore();
  activities.unshift({
    id: `act-${Date.now()}`,
    requestId: id,
    action: "Note Added",
    details: `Internal note added by ${author}`,
    actor: author,
    time: now,
  });
  saveData("ch_activities", activities);

  return req;
}
