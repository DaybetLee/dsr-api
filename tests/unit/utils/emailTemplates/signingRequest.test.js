const signingRequestEmail = require("../../../../utils/emailTemplates/signingRequest");

describe("signing request email", () => {
  it("should return email markup with the given input", () => {
    const result = signingRequestEmail({ name: "iwaðe" }, { name: "atengi" });
    expect(result).toContain("iwaðe");
    expect(result).toContain("atengi");
  });
});
