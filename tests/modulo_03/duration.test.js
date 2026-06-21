import { validateEventDuration } from "../../services/eventService";

describe("M03-RF02: Configuration of Event Duration Unit Tests", () => {
	// Test 1: Successful validation within range
	test("should successfully validate duration when it is within acceptable bounds", () => {
		const validDuration = 45; // 45 minutes

		const result = validateEventDuration(validDuration);

		expect(result).toBe(true);
	});

	// Test 2: Error check below minimum allowed duration
	test("should throw an error if the duration is less than 5 minutes", () => {
		const invalidShortDuration = 3; // Below 5 minutes

		expect(() => {
			validateEventDuration(invalidShortDuration);
		}).toThrow("The minimum allowed duration is 5 minutes.");
	});

	// Test 3: Error check above maximum allowed duration
	test("should throw an error if the duration exceeds 8 hours", () => {
		const invalidLongDuration = 500; // Above 480 minutes (8 hours)

		expect(() => {
			validateEventDuration(invalidLongDuration);
		}).toThrow("The maximum allowed duration is 8 hours (480 minutes).");
	});
});
