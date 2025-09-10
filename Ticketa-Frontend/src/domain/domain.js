// --- Error Response ---
/**
 * @typedef {Object} ErrorResponse
 * @property {string} error
 */
export const isErrorResponse = (obj) =>
  !!(obj && typeof obj === "object" && "error" in obj && typeof obj.error === "string");

// --- Event Status ---
export const EventStatusEnum = Object.freeze({
  DRAFT: "DRAFT",
  PUBLISHED: "PUBLISHED",
  ARCHIVED: "ARCHIVED",
});

// --- Requests & DTOs ---
/**
 * @typedef {Object} CreateTicketTypeRequest
 * @property {string} name
 * @property {number} price
 * @property {string} description
 * @property {number} [totalAvailable]
 */

/**
 * @typedef {Object} CreateEventRequest
 * @property {string} name
 * @property {Date} [start]
 * @property {Date} [end]
 * @property {string} venue
 * @property {Date} [salesStart]
 * @property {Date} [salesEnd]
 * @property {string} status
 * @property {CreateTicketTypeRequest[]} ticketTypes
 */

/**
 * @typedef {Object} UpdateTicketTypeRequest
 * @property {string} [id]
 * @property {string} name
 * @property {number} price
 * @property {string} description
 * @property {number} [totalAvailable]
 */

/**
 * @typedef {Object} UpdateEventRequest
 * @property {string} id
 * @property {string} name
 * @property {Date} [start]
 * @property {Date} [end]
 * @property {string} venue
 * @property {Date} [salesStart]
 * @property {Date} [salesEnd]
 * @property {string} status
 * @property {UpdateTicketTypeRequest[]} ticketTypes
 */

// --- Summaries & Details ---
/**
 * @typedef {Object} TicketTypeSummary
 * @property {string} id
 * @property {string} name
 * @property {number} price
 * @property {string} description
 * @property {number} [totalAvailable]
 */

/**
 * @typedef {Object} EventSummary
 * @property {string} id
 * @property {string} name
 * @property {Date} [start]
 * @property {Date} [end]
 * @property {string} venue
 * @property {Date} [salesStart]
 * @property {Date} [salesEnd]
 * @property {string} status
 * @property {TicketTypeSummary[]} ticketTypes
 */

/**
 * @typedef {Object} PublishedEventSummary
 * @property {string} id
 * @property {string} name
 * @property {Date} [start]
 * @property {Date} [end]
 * @property {string} venue
 */

// --- Pagination ---
export const SpringBootPagination = {
  content: [],
  first: true,
  last: true,
  number: 0,          // current page index
  totalPages: 0,
  totalElements: 0,
  size: 10,
  numberOfElements: 0,
};

// --- Tickets ---
export const TicketStatus = Object.freeze({
  PURCHASED: "PURCHASED",
  CANCELLED: "CANCELLED",
});

export const TicketValidationMethod = Object.freeze({
  QR_SCAN: "QR_SCAN",
  MANUAL: "MANUAL",
});

export const TicketValidationStatus = Object.freeze({
  VALID: "VALID",
  INVALID: "INVALID",
  EXPIRED: "EXPIRED",
});
export const TicketSummary = {
  id: "",
  status: "",
  ticketType: { id: "", name: "", price: 0 },
};

/**
 * @typedef {Object} TicketSummaryTicketType
 * @property {string} id
 * @property {string} name
 * @property {number} price
 */
/**

/**
 * @typedef {Object} TicketDetails
 * @property {string} id
 * @property {string} status
 * @property {number} price
 * @property {string} description
 * @property {string} eventName
 * @property {string} eventVenue
 * @property {Date} eventStart
 * @property {Date} eventEnd
 */

/**
 * @typedef {Object} TicketValidationRequest
 * @property {string} id
 * @property {string} method
 */

/**
 * @typedef {Object} TicketValidationResponse
 * @property {string} ticketId
 * @property {string} status
 */
