import { getDbItem, setDbItem } from "@/services/db";

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
  assignedName?: string;
  createdTime: string;
  documents: { name: string; size: string }[];
  internalNotes: { id: string; author: string; content: string; time: string }[];
}

export interface TravelRequestInput {
  customerName: string;
  email: string;
  phone: string;
  type: RequestType;
  title: string;
  details: string;
  amount: number;
  documents?: { name: string; size: string }[];
}

export async function submitTravelRequest(input: TravelRequestInput): Promise<TravelRequest> {
  const requests = getDbItem<TravelRequest[]>("travelRequests") || [];
  const activityLogs = getDbItem<any[]>("activityLogs") || [];
  const emailLogs = getDbItem<any[]>("emailLogs") || [];

  const newRequest: TravelRequest = {
    id: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
    customerName: input.customerName,
    email: input.email,
    phone: input.phone,
    type: input.type,
    title: input.title,
    details: input.details,
    status: "Pending",
    amount: input.amount,
    assignedTo: "",
    createdTime: new Date().toISOString(),
    documents: input.documents || [],
    internalNotes: [],
  };

  requests.push(newRequest);
  setDbItem<TravelRequest[]>("travelRequests", requests);

  // Log activity
  activityLogs.push({
    id: `log-${Date.now()}`,
    text: `${input.customerName} submitted a ${input.type} request: ${input.title}`,
    timestamp: new Date().toISOString(),
  });
  setDbItem<any[]>("activityLogs", activityLogs);

  // Log email
  emailLogs.push({
    id: `email-${Date.now()}`,
    to: input.email,
    subject: `Cairo Hangzhou - Travel Request Received (${newRequest.id})`,
    body: `Dear ${input.customerName},\n\nWe have received your travel request for "${input.title}". An advisor will review it shortly.`,
    timestamp: new Date().toISOString(),
  });
  setDbItem<any[]>("emailLogs", emailLogs);

  return newRequest;
}

export async function fetchTravelRequests() {
  const requests = getDbItem<TravelRequest[]>("travelRequests") || [];
  const activityLogs = getDbItem<any[]>("activityLogs") || [];
  const emailLogs = getDbItem<any[]>("emailLogs") || [];

  // Map legacy mock requests to correct type shape if they are formatted differently in db.ts
  const mappedRequests = requests.map((r: any) => ({
    id: r.id,
    customerName: r.customerName,
    email: r.email,
    phone: r.phone,
    type: r.type as RequestType,
    title: r.title,
    details: r.details,
    status: (r.status === "pending" ? "Pending" : r.status) as RequestStatus,
    amount: r.amount,
    assignedTo: r.assignedTo || "",
    assignedName: r.assignedName || "",
    createdTime: r.createdTime || r.createdAt || new Date().toISOString(),
    documents: r.documents || [],
    internalNotes: (r.notes || r.internalNotes || []).map((n: any, idx: number) => ({
      id: n.id || `n-${idx}`,
      author: n.author,
      content: n.content || n.text,
      time: n.time || n.timestamp || new Date().toISOString(),
    })),
  }));

  return {
    requests: mappedRequests,
    activityLogs,
    emailLogs,
  };
}

export async function fetchMyTravelRequests() {
  const currentUser = getDbItem<any>("currentUser");
  const data = await fetchTravelRequests();

  if (!currentUser) return [];
  return data.requests.filter((r) => r.email.toLowerCase() === currentUser.email.toLowerCase());
}

export async function updateTravelRequestStatus(id: string, status: RequestStatus) {
  const requests = getDbItem<TravelRequest[]>("travelRequests") || [];
  let updatedRequest: TravelRequest | null = null;

  const updated = requests.map((r: any) => {
    if (r.id === id) {
      updatedRequest = {
        ...r,
        status: status as RequestStatus,
      };
      return updatedRequest;
    }
    return r;
  });

  setDbItem<TravelRequest[]>("travelRequests", updated);

  if (!updatedRequest) throw new Error("Request not found");
  return updatedRequest;
}

export async function assignTravelRequest(id: string, assignedTo: string) {
  const requests = getDbItem<TravelRequest[]>("travelRequests") || [];
  const users = getDbItem<any[]>("users") || [];
  const employee = users.find((u) => u.id === assignedTo);
  let updatedRequest: TravelRequest | null = null;

  const updated = requests.map((r: any) => {
    if (r.id === id) {
      updatedRequest = {
        ...r,
        assignedTo,
        assignedName: employee ? employee.name : "Unassigned",
      };
      return updatedRequest;
    }
    return r;
  });

  setDbItem<TravelRequest[]>("travelRequests", updated);

  if (!updatedRequest) throw new Error("Request not found");
  return updatedRequest;
}

export async function addTravelRequestNote(id: string, content: string) {
  const requests = getDbItem<TravelRequest[]>("travelRequests") || [];
  const currentUser = getDbItem<any>("currentUser");
  let updatedRequest: TravelRequest | null = null;

  const updated = requests.map((r: any) => {
    if (r.id === id) {
      const notes = r.internalNotes || r.notes || [];
      updatedRequest = {
        ...r,
        internalNotes: [
          ...notes.map((n: any, idx: number) => ({
            id: n.id || `n-${idx}`,
            author: n.author,
            content: n.content || n.text,
            time: n.time || n.timestamp || new Date().toISOString(),
          })),
          {
            id: `note-${Date.now()}`,
            author: currentUser ? currentUser.name : "System",
            content,
            time: new Date().toISOString(),
          },
        ],
      };
      return updatedRequest;
    }
    return r;
  });

  setDbItem<TravelRequest[]>("travelRequests", updated);

  if (!updatedRequest) throw new Error("Request not found");
  return updatedRequest;
}
