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
});
