import { createEvent, resetEventsDatabase } from "../../services/eventService";

describe("M03-RF01: Event Type Management (ABM) Unit Tests", () => {
	// Clean up the database mock before each test to ensure test isolation
	beforeEach(() => {
		resetEventsDatabase();
	});

	// Test 1: Successful creation
	test("should successfully create a new event type when data is valid", () => {
		const validEvent = {
			name: "Follow-up Meeting",
			status: "Active",
		};

		const result = createEvent(validEvent);

		expect(result).toHaveProperty("id");
		expect(result.name).toBe("Follow-up Meeting");
		expect(result.status).toBe("Active");
	});

	// Test 2: Validation for duplicate name (Case insensitive)
	test("should throw an error if the event name already exists", () => {
		const duplicateEvent = {
			name: "Initial Consultation", // Already exists in the database mock
			status: "Active",
		};

		expect(() => {
			createEvent(duplicateEvent);
		}).toThrow("An event with this name already exists.");
	});

	// Test 3: Validation for empty or missing name
	test("should throw an error if the event name is empty or missing", () => {
		const invalidEvent = {
			name: "   ", // Empty whitespaces
			status: "Active",
		};

		expect(() => {
			createEvent(invalidEvent);
		}).toThrow("Event name is required.");
	});
});
