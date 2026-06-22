import { createEvent, resetEventsDatabase } from "../../services/eventService";

describe("M03 - Event duplicate validation", () => {
  beforeEach(() => {
    resetEventsDatabase();
  });

  test("should reject duplicate event names even when casing is different", () => {
    const duplicateEvent = {
      name: "initial consultation",
      status: "Active",
    };

    expect(() => {
      createEvent(duplicateEvent);
    }).toThrow("An event with this name already exists.");
  });
});
