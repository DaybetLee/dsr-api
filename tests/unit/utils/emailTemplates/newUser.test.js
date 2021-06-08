const newUserEmail = require("../../../../utils/emailTemplates/newUser");

describe("new user email", () => {
  it("should return email markup with the given input", () => {
    const result = newUserEmail({ name: "iwaðe" }, "atengi");

    expect(result).toContain("iwaðe");
    expect(result).toContain("atengi");
  });
});
