const { getTimeDiff, getWeekday } = require("../../../utils/helperFunction");

describe("getTimeDiff", () => {
  it("should return a postive number date2 us longer than date1", () => {
    const date1 = new Date("2021-01-01T00:00:00.000+08:00");
    const date2 = new Date("2021-01-01T00:01:00.000+08:00");
    const result = getTimeDiff(date1, date2);
    expect(result).toBe(1);
  });

  it("should return a negative number date1 us longer than date2", () => {
    const date1 = new Date("2021-01-01T00:01:00.000+08:00");
    const date2 = new Date("2021-01-01T00:00:00.000+08:00");
    const result = getTimeDiff(date1, date2);
    expect(result).toBe(-1);
  });

  it("should return 0 if date1 is equal to date2", () => {
    const date1 = new Date("2021-01-01T00:00:00.000+08:00");
    const date2 = new Date("2021-01-01T00:00:00.000+08:00");
    const result = getTimeDiff(date1, date2);
    expect(result).toBe(0);
  });
});

describe("getWeekday", () => {
  it("should return a true if input day fall on a weekday", () => {
    const weekdays = [
      new Date("2021-01-01T00:00:00.000+08:00"),
      new Date("2021-01-04T00:00:00.000+08:00"),
      new Date("2021-01-05T00:00:00.000+08:00"),
      new Date("2021-01-06T00:00:00.000+08:00"),
      new Date("2021-01-07T00:00:00.000+08:00"),
    ];

    weekdays.map((day) => {
      const result = getWeekday(day);
      expect(result).toBe(true);
    });
  });

  it("should return a false if input day fall on a weekend", () => {
    const weekends = [
      new Date("2021-01-02T00:00:00.000+08:00"),
      new Date("2021-01-03T00:00:00.000+08:00"),
    ];

    weekends.map((day) => {
      const result = getWeekday(day);
      expect(result).toBe(false);
    });
  });
});
