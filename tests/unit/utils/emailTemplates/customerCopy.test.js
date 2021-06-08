const moment = require("moment");

const customerEmail = require("../../../../utils/emailTemplates/customerCopy");

describe("customer email template", () => {
  it("should return email markup with the given input", () => {
    let payload = {
      reportNumber: "000000",
      companyName: "iwaðe atengi",
      address: "dyydn road",
      contactPersonEmail: "lbedrepaa@iwaðe.com",
      productVendor: "ðimh",
      site: "atiðho",
      contactPerson: "eem",
      telephone: "11111111",
      jobCategory: "replacement",
      ticketNumber: "12345678",
      actionTaken: "diðíhøelo þwikiþunho hsediw",
      remark: "eiplþito domaoba fdfag",
      swapReason: "Permenant",
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
      userSignature: "userSignature",
      customerSignature: "customerSignature",
      signedByUser: "signedByUser",
      signedBy: "signedBy",
    };

    let result = customerEmail(payload);
    Object.values(payload).forEach((value) => {
      if (typeof value === "object") {
        Object.values(value).forEach((partNumber) =>
          Object.values(partNumber).forEach((value) =>
            expect(result).toContain(value)
          )
        );
      } else expect(result).toContain(value);
    });

    payload["serviceDateTime"] = new Date("2021-01-01T00:00:00.000+08:00");
    payload["completedDateTime"] = new Date("2021-01-02T00:00:00.000+08:00");
    payload["chargeable"] = true;

    result = customerEmail(payload);
    expect(result).toContain(moment(payload.serviceDateTime).format("LLL"));
    expect(result).toContain(moment(payload.completedDateTime).format("LLL"));
    expect(result).toContain("yes");

    payload["chargeable"] = false;
    result = customerEmail(payload);
    expect(result).toContain("no");
  });
});
