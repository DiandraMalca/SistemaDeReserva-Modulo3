import {
	createBooking,
	resetConfirmedBookingsList,
} from "../../services/bookingService";

describe("M04-RF05: Confirmation of Booking Process Unit Tests", () => {
	// Clean up database list before each test execution
	beforeEach(() => {
		resetConfirmedBookingsList();
	});

	// Test 1: Successful booking creation with all required data
	test("should successfully confirm and register a booking when all guest payload is valid", () => {
		const validPayload = {
			guestName: "John Doe",
			guestEmail: "john.doe@example.com",
			startTime: "2026-06-26T10:00:00.000Z",
			endTime: "2026-06-26T10:30:00.000Z",
			status: "Confirmed",
		};

		const bookingResult = createBooking(validPayload);

		expect(bookingResult).toHaveProperty("bookingId");
		expect(bookingResult.guestName).toBe("John Doe");
		expect(bookingResult.status).toBe("Confirmed");
		expect(bookingResult).toHaveProperty("createdAt");
	});

	// Test 2: Error handling when guest name is missing
	test("should throw an error if the guest name is empty or missing during confirmation", () => {
		const missingNamePayload = {
			guestName: "   ", // Blank name string
			guestEmail: "anonymous@example.com",
			startTime: "2026-06-26T10:00:00.000Z",
			endTime: "2026-06-26T10:30:00.000Z",
		};

		expect(() => {
			createBooking(missingNamePayload);
		}).toThrow("Guest name is mandatory to complete the booking.");
	});

	// Test 3: Error handling for invalid email format
	test("should throw an error if the provided guest email does not follow a valid format", () => {
		const invalidEmailPayload = {
			guestName: "Jane Doe",
			guestEmail: "janedoe_without_at.com", // Missing '@'
			startTime: "2026-06-26T11:00:00.000Z",
			endTime: "2026-06-26T11:30:00.000Z",
		};

		expect(() => {
			createBooking(invalidEmailPayload);
		}).toThrow("A valid guest email is required.");
	});
});
