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
