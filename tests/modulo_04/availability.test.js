import {
  validateSlotAvailability,
  resetBookingDatabase,
} from "../../services/bookingService";

describe("M04-RF03: Validation of Availability (No Overlap) Unit Tests", () => {
  // Clean up the booking records before each test to ensure test isolation
  beforeEach(() => {
    resetBookingDatabase();
  });

  // Test 1: Successful slot choice (No overlap)
  test("should successfully validate availability when the requested slot is completely free", () => {
    const requestedStart = "2026-06-25T14:30:00.000Z";
    const requestedEnd = "2026-06-25T15:00:00.000Z";

    const isAvailable = validateSlotAvailability(requestedStart, requestedEnd);

    expect(isAvailable).toBe(true);
  });

  // Test 2: Error check when requested slot overlaps with an existing booking
  test("should throw an error if the requested slot overlaps with an already confirmed booking", () => {
    // This requested slot partially overlaps with existing booking b2 (15:00 - 16:00)
    const partialOverlapStart = "2026-06-25T15:15:00.000Z";
    const partialOverlapEnd = "2026-06-25T15:45:00.000Z";

    expect(() => {
      validateSlotAvailability(partialOverlapStart, partialOverlapEnd);
    }).toThrow("The selected time slot is no longer available.");
  });

  // Test 3: Validation error for logical integrity of times
  test("should throw an error if the requested start time occurs after or at the same time as the end time", () => {
    const invalidStart = "2026-06-25T17:00:00.000Z";
    const invalidEnd = "2026-06-25T16:30:00.000Z"; // End time is before start time

    expect(() => {
      validateSlotAvailability(invalidStart, invalidEnd);
    }).toThrow("Invalid time range: start time must be before end time.");
  });
});
