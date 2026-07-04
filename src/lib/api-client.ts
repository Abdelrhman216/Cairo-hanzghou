"use client";

import type { RequestStatus, RequestType, TravelRequest } from "@/lib/server-store";

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
  const res = await fetch("/api/requests", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  const data = await res.json();
  if (!res.ok || !data.request) {
    throw new Error(data.error || "Failed to submit request");
  }
  return data.request;
}

export async function fetchTravelRequests() {
  const res = await fetch("/api/requests", { cache: "no-store" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to load requests");
  return data as {
    requests: TravelRequest[];
    activityLogs: any[];
    emailLogs: any[];
  };
}

export async function fetchMyTravelRequests() {
  const res = await fetch("/api/requests/mine", { cache: "no-store" });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to load your requests");
  return data.requests as TravelRequest[];
}

export async function updateTravelRequestStatus(id: string, status: RequestStatus) {
  const res = await fetch(`/api/requests/${id}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to update status");
  return data.request as TravelRequest;
}

export async function assignTravelRequest(id: string, assignedTo: string) {
  const res = await fetch(`/api/requests/${id}/assign`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ assignedTo }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to assign request");
  return data.request as TravelRequest;
}

export async function addTravelRequestNote(id: string, content: string) {
  const res = await fetch(`/api/requests/${id}/note`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content, author: "Admin Agent" }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to save note");
  return data.request as TravelRequest;
}
