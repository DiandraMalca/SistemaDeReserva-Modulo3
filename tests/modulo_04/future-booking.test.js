import {
  createBooking,
  resetConfirmedBookingsList,
} from "../../services/bookingService";

describe("M04-RF05: Future Booking Date Validation Unit Tests", () => {
  beforeEach(() => {
    resetConfirmedBookingsList();
  });

  test("should successfully register a booking scheduled in the future", () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);

    const validPayload = {
      guestName: "Rodrigo Vargas",
      guestEmail: "rodrigo.vargas@example.com",
      startTime: futureDate.toISOString(),
      endTime: new Date(futureDate.getTime() + 30 * 60000).toISOString(),
      status: "Confirmed",
    };

    const bookingResult = createBooking(validPayload);

    expect(bookingResult).toHaveProperty("bookingId");
    expect(bookingResult.guestName).toBe("Rodrigo Vargas");
    expect(bookingResult.status).toBe("Confirmed");
  });

  test("should throw an error if the booking is scheduled in the past", () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);

    const invalidPayload = {
      guestName: "Rodrigo Vargas",
      guestEmail: "rodrigo.vargas@example.com",
      startTime: pastDate.toISOString(),
      endTime: new Date(pastDate.getTime() + 30 * 60000).toISOString(),
    };

    expect(() => {
      createBooking(invalidPayload);
    }).toThrow("Booking start time must be in the future.");
  });

  test("should throw an error if the booking starts in the immediate past", () => {
    const immediatePastDate = new Date();
    immediatePastDate.setMinutes(immediatePastDate.getMinutes() - 10);

    const invalidPayload = {
      guestName: "Rodrigo Vargas",
      guestEmail: "rodrigo.vargas@example.com",
      startTime: immediatePastDate.toISOString(),
      endTime: new Date(immediatePastDate.getTime() + 30 * 60000).toISOString(),
    };

    expect(() => {
      createBooking(invalidPayload);
    }).toThrow("Booking start time must be in the future.");
  });
});
