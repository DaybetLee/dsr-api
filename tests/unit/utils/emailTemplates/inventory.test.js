const inventoryEmail = require("../../../../utils/emailTemplates/inventory");

describe("inventory email template", () => {
  it("should return email markup with the given input", () => {
    let payload = {
      companyName: "ungþeangh ",
      movementType: "Direct RMA",
      productVendor: "dyenioni ",
      ticketNumber: "1111111",
      companyName: "łaþttenðuh ",
      partNumber: [
        {
          partNo: "partNumber.partNo.0",
          from: "partNumber.from.0",
          to: "partNumber.to.0",
        },
        {
          partNo: "partNumber.partNo.1",
          from: "partNumber.from.1",
          to: "partNumber.to.1",
        },
        {
          partNo: "partNumber.partNo.2",
          from: "partNumber.from.2",
          to: "partNumber.to.2",
        },
        {
          partNo: "partNumber.partNo.3",
          from: "partNumber.from.3",
          to: "partNumber.to.3",
        },
        {
          partNo: "partNumber.partNo.4",
          from: "partNumber.from.4",
          to: "partNumber.to.4",
        },
        {
          partNo: "partNumber.partNo.5",
          from: "partNumber.from.5",
          to: "partNumber.to.5",
        },
        {
          partNo: "partNumber.partNo.6",
          from: "partNumber.from.6",
          to: "partNumber.to.6",
        },
        {
          partNo: "partNumber.partNo.7",
          from: "partNumber.from.7",
          to: "partNumber.to.7",
        },
      ],
    };

    let result = inventoryEmail(payload);
    Object.values(payload).forEach((value) => {
      if (typeof value === "object") {
        Object.values(value).forEach((partNumber) =>
          Object.values(partNumber).forEach((value) =>
            expect(result).toContain(value)
          )
        );
      } else expect(result).toContain(value);
    });
  });
});
