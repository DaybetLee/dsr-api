const request = require("supertest");
const mongoose = require("mongoose");
const { BusinessUnit } = require("../../../models/businessUnit");
const { User } = require("../../../models/user");

let server;

describe("/api/businessunit", () => {
  let token;

  beforeEach(() => {
    server = require("../../../index");
    token = new User().generateAuthToken();
  });

  afterEach(async () => {
    await server.close();
    await BusinessUnit.deleteMany({});
  });

  //////////////////////////////////////////////////////////////////////////////////////
  describe("GET /", () => {
    it("should return all businessUnit", async () => {
      const businessUnits = [
        { name: "businessUnit1", description: "description1" },
        { name: "businessUnit2", description: "description2" },
      ];

      await BusinessUnit.collection.insertMany(businessUnits);

      const res = await request(server)
        .get("/api/businessunit")
        .set("x-auth-token", token);

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((b) => b.name === "businessUnit1")).toBeTruthy();
      expect(res.body.some((b) => b.name === "businessUnit2")).toBeTruthy();
      expect(
        res.body.some((p) => p.description === "description1")
      ).toBeTruthy();
      expect(
        res.body.some((p) => p.description === "description2")
      ).toBeTruthy();
    });
  });

  //////////////////////////////////////////////////////////////////////////////////////
  describe("GET /:id", () => {
    it("should return a businessUnit if valid id is passed", async () => {
      const businessUnit = new BusinessUnit({ name: "BusinessUnit1" });
      await businessUnit.save();

      const res = await request(server)
        .get("/api/businessunit/" + businessUnit._id)
        .set("x-auth-token", token);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", businessUnit.name);
    });

    it("should return 404 if no businessunit with the given id exists", async () => {
      const id = mongoose.Types.ObjectId();
      const res = await request(server)
        .get("/api/businessunit/" + id)
        .set("x-auth-token", token);

      expect(res.status).toBe(404);
    });
  });

  ////////////////////////////////////////////////////////////////////////////////////
  describe("POST /", () => {
    let name;
    let description;

    const exec = async () => {
      return await request(server)
        .post("/api/businessunit")
        .set("x-auth-token", token)
        .send({ name, description });
    };

    beforeEach(() => {
      name = "businessunit1";
      description = "description2";
    });

    it("should return 400 if businessUnit is empty", async () => {
      name = "";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if businessUnit is more than 255 characters", async () => {
      name = new Array(257).join("a");

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if businessUnit description is more than 255 characters", async () => {
      description = new Array(257).join("a");

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should save the businessUnit if it is valid", async () => {
      await exec();

      const businessUnit = await BusinessUnit.find({ name: "businessUnit1" });

      expect(businessUnit).not.toBeNull();
      expect(businessUnit[0]).toHaveProperty("_id");
      expect(businessUnit[0]).toHaveProperty("name");
      expect(businessUnit[0]).toHaveProperty("description");
    });
  });

  ////////////////////////////////////////////////////////////////////////////////////
  describe("PUT /:id", () => {
    let newName;
    let newDescription;
    let businessUnit;
    let id;

    const exec = async () => {
      return await request(server)
        .put("/api/businessunit/" + id)
        .set("x-auth-token", token)
        .send({ name: newName, description: newDescription });
    };

    beforeEach(async () => {
      businessUnit = new BusinessUnit({
        name: "businessUnit1",
        description: "description1",
      });
      await businessUnit.save();

      id = businessUnit._id;
      newName = "updatedName";
      newDescription = "updateDescription";
    });

    it("should return 400 if businessUnit name is empty", async () => {
      newName = "";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if businessUnit name is more than 255 characters", async () => {
      newName = new Array(257).join("a");

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if businessUnit description is more than 255 characters", async () => {
      newDescription = new Array(257).join("a");

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 404 if businessUnit with the given id was not found", async () => {
      id = mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should update the businessUnit if input is valid", async () => {
      const res = await exec();

      const updatedBusinessUnit = await BusinessUnit.findById(businessUnit._id);

      expect(res.status).toBe(200);
      expect(updatedBusinessUnit.name).toBe(newName.toUpperCase());
      expect(updatedBusinessUnit.description).toBe(newDescription);
    });
  });

  ////////////////////////////////////////////////////////////////////////////////////
  describe("DELETE /:id", () => {
    let businessUnit;
    let id;

    const exec = async () => {
      return await request(server)
        .delete("/api/businessunit/" + id)
        .set("x-auth-token", token)
        .send();
    };

    beforeEach(async () => {
      businessUnit = new BusinessUnit({
        name: "businessUnit",
        description: "description1",
      });
      await businessUnit.save();

      id = businessUnit._id;
    });

    it("should return 404 if no businessUnit with the given id was found", async () => {
      id = mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should delete the businessUnit if input is valid", async () => {
      const res = await exec();

      const businessUnitInDb = await BusinessUnit.findById(id);

      expect(res.status).toBe(200);
      expect(businessUnitInDb).toBeNull();
    });
  });
});
