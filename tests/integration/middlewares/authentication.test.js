const { BusinessUnit } = require("../../../models/businessUnit");
const { User } = require("../../../models/user");
const request = require("supertest");

describe("authentication middleware", () => {
  let token;

  beforeEach(() => {
    server = require("../../../index");
    token = new User().generateAuthToken();
  });

  afterEach(async () => {
    await BusinessUnit.deleteMany({});
    await server.close();
  });

  const exec = () => {
    return request(server).get("/api/businessunit").set("x-auth-token", token);
  };

  it("should return 401 if no token is provided", async () => {
    token = "";

    const res = await exec();

    expect(res.status).toBe(401);
  });

  it("should return 400 if token is invalid", async () => {
    token = "a";

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it("should return 200 if token is valid", async () => {
    const res = await exec();

    expect(res.status).toBe(200);
  });
});
