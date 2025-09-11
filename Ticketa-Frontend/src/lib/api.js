// src/lib/api.js
import { isErrorResponse } from "@/domain/domain";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? ""; // '' so proxy works in dev

function buildUrl(path) {
  if (path.startsWith("http")) return path;
  return `${API_BASE}${path}`;
}

async function handleResponse(res) {
  const text = await res.text();
  try {
    const json = text ? JSON.parse(text) : null;
    if (!res.ok) {
      const err = new Error(json?.message || res.statusText || 'API error');
      err.status = res.status;
      err.body = json;
      throw err;
    }
    return json;
  } catch (e) {
    // non-json responses (like HTML error pages)
    if (!res.ok) {
      const err = new Error(text || res.statusText || 'API error');
      err.status = res.status;
      err.body = text;
      throw err;
    }
    return text;
  }
}

export async function apiFetch(
  path,
  { method = "GET", body, token, headers = {} } = {}
) {
  const url = buildUrl(path);
  const opts = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };
  if (token) opts.headers["Authorization"] = `Bearer ${token}`;
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(url, opts);
  return handleResponse(res);
}

export default {
  apiFetch,
};

// -------------------------
// Event APIs
// -------------------------

export const createEvent = (accessToken, request) =>
  apiFetch("/events/create", {
    method: "POST",
    body: request,
    token: accessToken,
  });

export const updateEvent = (accessToken, id, request) =>
  apiFetch(`/events/update/${id}`, {
    method: "PUT",
    body: request,
    token: accessToken,
  });

export const listEvents = (accessToken, page, size = 3) =>
  apiFetch(`/events/list-all?page=${page}&size=${size}`, {
    token: accessToken,
  });

export const getEvent = (accessToken, id) =>
  apiFetch(`/events/${id}`, {
    token: accessToken,
  });

export const deleteEvent = (accessToken, id) =>
  apiFetch(`/events/delete/${id}`, {
    method: "DELETE",
    token: accessToken,
  });

// -------------------------
// Published Events APIs
// -------------------------

export const listPublishedEvents = (page, size = 4, query) => {
  const queryParam = query ? `&query=${encodeURIComponent(query)}` : "";
  return apiFetch(`/published-events?page=${page}&size=${size}${queryParam}`);
};

export const searchPublishedEvents = (query, page = 1, size = 4) => {
  if (!query) return { events: [], total: 0 };
  const queryParam = `query=${encodeURIComponent(query)}`;
  return apiFetch(`/published-events?page=${page}&size=${size}&${queryParam}`);
};

export const getPublishedEvent = (id) =>
  apiFetch(`/published-events/${id}`);

// -------------------------
// Tickets APIs
// -------------------------

export const listTickets = (accessToken, page, size = 8) =>
  apiFetch(`/tickets?page=${page}&size=${size}`, {
    token: accessToken,
  });

export const getTicket = (accessToken, id) =>
  apiFetch(`/tickets/${id}`, {
    token: accessToken,
  });

export const getTicketQr = async (accessToken, id) => {
  const url = buildUrl(`/tickets/${id}/qr-code`);
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (res.ok) return await res.blob();
  throw new Error("Unable to get ticket QR code");
};

export const purchaseTicket = (accessToken, eventId, ticketTypeId) =>
  apiFetch(`/events/${eventId}/ticket-types/${ticketTypeId}/tickets`, {
    method: "POST",
    token: accessToken,
  });

// -------------------------
// Ticket Validation APIs
// -------------------------

export const validateTicket = (accessToken, request) =>
  apiFetch(`/ticket-validations`, {
    method: "POST",
    body: request,
    token: accessToken,
  });
