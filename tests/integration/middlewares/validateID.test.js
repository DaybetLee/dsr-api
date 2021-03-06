const { BusinessUnit } = require("../../../models/businessUnit");
const { User } = require("../../../models/user");
const request = require("supertest");

describe("validateID middleware", () => {
  let token;
  let businessunit;
  let id;

  const exec = async () => {
    return await request(server)
      .delete("/api/businessunit/" + id)
      .set("x-auth-token", token)
      .send();
  };

  beforeEach(async () => {
    server = require("../../../index");
    businessunit = new BusinessUnit({ name: "businessunit1" });
    await businessunit.save();

    id = businessunit._id;
    token = new User().generateAuthToken();
  });

  afterEach(async () => {
    await server.close();
    await BusinessUnit.deleteMany({});
  });

  it("should return 404 if id is invalid", async () => {
    id = 1;

    const res = await exec();

    expect(res.status).toBe(404);
  });

  it("should successfully excute the next route if id is valid", async () => {
    await exec();

    const businessUnitInDb = await BusinessUnit.findById(id);

    expect(businessUnitInDb).toBeNull();
  });
});
