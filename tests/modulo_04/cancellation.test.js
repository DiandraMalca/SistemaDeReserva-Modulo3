import { cancelBooking } from "../../services/bookingService";

describe("M04-RF07: Guest Booking Cancellation Unit Tests", () => {
  // Test 1: Successful cancellation within the allowed time frame
  test("should successfully cancel an active booking when requested within the permitted timeframe", () => {
    // Setting up an appointment 48 hours in the future (well over the 24h limit)
    const futureDate = new Date();
    futureDate.setHours(futureDate.getHours() + 48);

    const activeBooking = {
      bookingId: "BK-8821",
      guestName: "Alice Smith",
      status: "Confirmed",
      startTime: futureDate.toISOString(),
    };

    const result = cancelBooking(activeBooking, 24);

    expect(result.status).toBe("Cancelled");
    expect(result).toHaveProperty("cancelledAt");
  });

  // Test 2: Error handling for cancellations outside the timeframe limit
  test("should throw an error and deny cancellation if the deadline has already expired", () => {
    // Setting up an appointment only 2 hours in the future (violating the 24h limit)
    const tightDate = new Date();
    tightDate.setHours(tightDate.getHours() + 2);

    const tightBooking = {
      bookingId: "BK-1102",
      guestName: "Bob Jones",
      status: "Confirmed",
      startTime: tightDate.toISOString(),
    };

    expect(() => {
      cancelBooking(tightBooking, 24);
    }).toThrow(
      "The cancellation deadline for this reservation has expired. Please contact the professional directly.",
    );
  });

  // Test 3: Error handling when the booking is already inactive
  test("should throw an error if trying to cancel a booking that is already Cancelled or Inactive", () => {
    const expiredDate = new Date();
    expiredDate.setHours(expiredDate.getHours() + 72);

    const alreadyCancelledBooking = {
      bookingId: "BK-0000",
      guestName: "Charlie Brown",
      status: "Cancelled", // Pre-condition not met
      startTime: expiredDate.toISOString(),
    };

    expect(() => {
      cancelBooking(alreadyCancelledBooking, 24);
    }).toThrow("Only active or pending bookings can be cancelled.");
  });

  // Test 4: Pending bookings are also eligible for cancellation
  test("should successfully cancel a Pending booking within the permitted timeframe", () => {
    const futureDate = new Date();
    futureDate.setHours(futureDate.getHours() + 48);

    const pendingBooking = {
      bookingId: "BK-7777",
      guestName: "Dana White",
      status: "Pending",
      startTime: futureDate.toISOString(),
    };

    const result = cancelBooking(pendingBooking, 24);

    expect(result.status).toBe("Cancelled");
    expect(result).toHaveProperty("cancelledAt");
  });

  // Test 5: Completed bookings cannot be cancelled
  test("should throw an error when trying to cancel a booking that is already Completed", () => {
    const pastDate = new Date();
    pastDate.setHours(pastDate.getHours() + 72);

    const completedBooking = {
      bookingId: "BK-9999",
      guestName: "Evan Lee",
      status: "Completed", // Pre-condition not met
      startTime: pastDate.toISOString(),
    };

    expect(() => {
      cancelBooking(completedBooking, 24);
    }).toThrow("Only active or pending bookings can be cancelled.");
  });

  // Test 6: The default cancellation limit (24h) applies when none is provided
  test("should apply the default 24h deadline and deny cancellation when the limit argument is omitted", () => {
    // Appointment only 10 hours away, under the default 24h limit
    const soonDate = new Date();
    soonDate.setHours(soonDate.getHours() + 10);

    const soonBooking = {
      bookingId: "BK-2024",
      guestName: "Fiona Green",
      status: "Confirmed",
      startTime: soonDate.toISOString(),
    };

    expect(() => {
      cancelBooking(soonBooking);
    }).toThrow(
      "The cancellation deadline for this reservation has expired. Please contact the professional directly.",
    );
  });

// Test 7: Custom cancellation limit (e.g., 48h) is respected over the default
  test("should respect a custom cancellation limit and deny when the appointment falls inside it", () => {
    // Appointment 30 hours away: fine for the 24h default, but inside a 48h limit
    const midDate = new Date();
    midDate.setHours(midDate.getHours() + 30);

    const midBooking = {
      bookingId: "BK-4848",
      guestName: "Grace Hall",
      status: "Confirmed",
      startTime: midDate.toISOString(),
    };

    expect(() => {
      cancelBooking(midBooking, 48);
    }).toThrow(
      "The cancellation deadline for this reservation has expired. Please contact the professional directly.",
    );
  });

  // Test 8: A cancellation comfortably past the limit succeeds at the boundary
  test("should allow cancellation when the appointment is just beyond the cancellation limit", () => {
    // Appointment 25 hours away, just over the 24h limit
    const boundaryDate = new Date();
    boundaryDate.setHours(boundaryDate.getHours() + 25);

    const boundaryBooking = {
      bookingId: "BK-2500",
      guestName: "Henry Ford",
      status: "Confirmed",
      startTime: boundaryDate.toISOString(),
    };

    const result = cancelBooking(boundaryBooking, 24);

    expect(result.status).toBe("Cancelled");
    expect(result).toHaveProperty("cancelledAt");
  });

  // Test 9: The original booking object must not be mutated and its data is preserved
  test("should preserve the original booking data and not mutate the input object", () => {
    const futureDate = new Date();
    futureDate.setHours(futureDate.getHours() + 48);

    const originalBooking = {
      bookingId: "BK-3030",
      guestName: "Ivy Wong",
      status: "Confirmed",
      startTime: futureDate.toISOString(),
    };

    const result = cancelBooking(originalBooking, 24);

    // Returned record keeps the identifying data
    expect(result.bookingId).toBe("BK-3030");
    expect(result.guestName).toBe("Ivy Wong");

    // The input object is left untouched (no in-place mutation)
    expect(originalBooking.status).toBe("Confirmed");
    expect(originalBooking).not.toHaveProperty("cancelledAt");
  });
});