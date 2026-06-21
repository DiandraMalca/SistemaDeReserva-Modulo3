import {
  determineBookingStatus,
  processLegacyBooking,
} from "../../services/bookingService";

describe("M03-RF03: Configuration of Confirmation Type Unit Tests", () => {
  // Test 1: Automatic confirmation behavior
  test("should set booking status directly to 'Confirmed' when confirmation type is 'Automatic'", () => {
    const confirmationType = "Automatic";

    const resultStatus = determineBookingStatus(confirmationType);

    expect(resultStatus).toBe("Confirmed");
  });

  // Test 2: Manual confirmation behavior
  test("should set booking status strictly to 'Pending' when confirmation type is 'Manual'", () => {
    const confirmationType = "Manual";

    const resultStatus = determineBookingStatus(confirmationType);

    expect(resultStatus).toBe("Pending");
  });

  // Test 3: Validation error handling & legacy protection
  test("should throw an error for unexpected confirmation types and protect legacy booking records", () => {
    // 3a. Check validation error for bad input
    const invalidType = "Instantaneous";
    expect(() => {
      determineBookingStatus(invalidType);
    }).toThrow("Invalid confirmation type specified.");

    // 3b. Ensure changing the system configuration does not alter past booking instances
    const legacyBooking = {
      id: "b-99",
      status: "Pending",
      eventType: "Consultation",
    };
    const currentSystemSetting = "Automatic";

    const statusAfterConfigChange = processLegacyBooking(
      legacyBooking,
      currentSystemSetting,
    );

    expect(statusAfterConfigChange).toBe("Pending"); // Must remain unchanged
  });
});
