/**
 * Simple service to handle Event Management (ABM) logic
 */

// In-memory array mock representing existing events in the database
let eventsDatabase = [
  { id: "1", name: "Initial Consultation", status: "Active" },
  { id: "2", name: "Technical Interview", status: "Active" },
];

/**
 * Validates and adds a new event type to the database.
 * @param {Object} newEvent - The event object to create.
 * @returns {Object} The created event.
 * @throws {Error} If validation fails.
 */
export function createEvent(newEvent) {
  if (!newEvent.name || newEvent.name.trim() === "") {
    throw new Error("Event name is required.");
  }

  // M03-RF01 Criterio de Aceptación: Prevent duplicate event names
  const nameExists = eventsDatabase.some(
    (event) => event.name.toLowerCase() === newEvent.name.toLowerCase(),
  );

  if (nameExists) {
    throw new Error("An event with this name already exists.");
  }

  const createdEvent = {
    id: String(eventsDatabase.length + 1),
    ...newEvent,
    status: newEvent.status || "Active",
  };

  eventsDatabase.push(createdEvent);
  return createdEvent;
}

/**
 * Helper to reset the mock database state between tests.
 */
export function resetEventsDatabase() {
  eventsDatabase = [
    { id: "1", name: "Initial Consultation", status: "Active" },
    { id: "2", name: "Technical Interview", status: "Active" },
  ];
}

/**
 * Validates the duration of an event type according to business rules.
 * Rule: Minimum 5 minutes, maximum 8 hours (480 minutes).
 * * @param {number} minutes - The duration in minutes.
 * @returns {boolean} True if valid.
 * @throws {Error} If duration is out of acceptable bounds.
 */
export function validateEventDuration(minutes) {
  if (typeof minutes !== "number" || isNaN(minutes)) {
    throw new Error("Duration must be a valid number.");
  }

  // Minimum boundary check (5 minutes)
  if (minutes < 5) {
    throw new Error("The minimum allowed duration is 5 minutes.");
  }

  // Maximum boundary check (8 hours = 480 minutes)
  if (minutes > 480) {
    throw new Error("The maximum allowed duration is 8 hours (480 minutes).");
  }

  return true;
}
