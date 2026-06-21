import {
  createBooking,
  resetConfirmedBookingsList,
} from "../../services/bookingService";

describe("M04 - Booking default status", () => {
  beforeEach(() => {
    resetConfirmedBookingsList();
  });

  test("should assign Pending status by default when creating a booking without explicit status", () => {
    const validPayload = {
      guestName: "Lucia Torres",
      guestEmail: "lucia.torres@example.com",
      startTime: "2026-06-26T12:00:00.000Z",
      endTime: "2026-06-26T12:30:00.000Z",
    };

    const bookingResult = createBooking(validPayload);

    expect(bookingResult.status).toBe("Pending");
  });
});