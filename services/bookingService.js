/**
 * Simple service to handle Booking and Confirmation logic (M03-RF03 / M04-RF05)
 */

/**
 * Determines the initial status of a booking based on the Event Type's confirmation setting.
 * @param {string} confirmationType - Either "Automatic" or "Manual".
 * @returns {string} The resulting status ("Confirmed" or "Pending").
 * @throws {Error} If the confirmation type is invalid.
 */
export function determineBookingStatus(confirmationType) {
  if (!confirmationType) {
    throw new Error("Confirmation type is required.");
  }

  const normalized = confirmationType.trim().toLowerCase();

  if (normalized === "automatic") {
    return "Confirmed";
  } else if (normalized === "manual") {
    return "Pending";
  } else {
    throw new Error("Invalid confirmation type specified.");
  }
}

/**
 * Validates if an existing booking status can be updated.
 * Changing confirmation settings globally should not implicitly alter old finalized booking records.
 * @param {Object} booking - The current booking object.
 * @param {string} currentSetting - The new rule ("Automatic" or "Manual").
 * @returns {string} The untouched or correctly validated status.
 */
export function processLegacyBooking(booking, currentSetting) {
  // Rule: Legacy bookings keep their current state regardless of global configuration updates
  return booking.status;
}

// In-memory array mock representing currently confirmed bookings in the system
let existingBookings = [
  {
    id: "b1",
    startTime: "2026-06-25T14:00:00.000Z",
    endTime: "2026-06-25T14:30:00.000Z",
  },
  {
    id: "b2",
    startTime: "2026-06-25T15:00:00.000Z",
    endTime: "2026-06-25T16:00:00.000Z",
  },
];

/**
 * Validates if a requested slot overlaps with any existing booking.
 * @param {string} requestedStart - ISO string of the requested start time.
 * @param {string} requestedEnd - ISO string of the requested end time.
 * @returns {boolean} True if the slot is completely available.
 * @throws {Error} If there is a scheduling conflict.
 */
export function validateSlotAvailability(requestedStart, requestedEnd) {
  const reqStart = new Date(requestedStart).getTime();
  const reqEnd = new Date(requestedEnd).getTime();

  if (reqStart >= reqEnd) {
    throw new Error("Invalid time range: start time must be before end time.");
  }

  // M04-RF03 Core Rule: Check overlap condition
  const hasOverlap = existingBookings.some((booking) => {
    const existingStart = new Date(booking.startTime).getTime();
    const existingEnd = new Date(booking.endTime).getTime();

    // Condition for overlapping: (StartA < EndB) AND (EndA > StartB)
    return reqStart < existingEnd && reqEnd > existingStart;
  });

  if (hasOverlap) {
    throw new Error("The selected time slot is no longer available.");
  }

  return true;
}

/**
 * Helper to reset availability mock database state between tests.
 */
export function resetBookingDatabase() {
  existingBookings = [
    {
      id: "b1",
      startTime: "2026-06-25T14:00:00.000Z",
      endTime: "2026-06-25T14:30:00.000Z",
    },
    {
      id: "b2",
      startTime: "2026-06-25T15:00:00.000Z",
      endTime: "2026-06-25T16:00:00.000Z",
    },
  ];
}
