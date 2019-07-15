import { minToHour } from "../helper/minToHour";

describe("Helper functions", () => {
  describe("minToHour", () => {
    it("should return no decimal places for whole numbers", () => {
      expect(minToHour(60)).toBe("1hr");
    });

    it("should return 1 decimal place for fractional hours", () => {
      expect(minToHour(90)).toBe("1.5hr");
    });
  });
});
