const request = require("supertest");
const mongoose = require("mongoose");
const { ProductVendor } = require("../../../models/productVendor");
const { User } = require("../../../models/user");

let server;

describe("/api/productvendor", () => {
  let token;

  beforeEach(() => {
    server = require("../../../index");
    token = new User().generateAuthToken();
  });

  afterEach(async () => {
    await server.close();
    await ProductVendor.deleteMany({});
  });

  ////////////////////////////////////////////////////////////////////////////////////
  describe("GET /", () => {
    it("should return all productVendor", async () => {
      const productVendors = [
        { name: "productVendor1", description: "description1" },
        { name: "productVendor2", description: "description2" },
      ];

      await ProductVendor.collection.insertMany(productVendors);

      const res = await request(server)
        .get("/api/productvendor")
        .set("x-auth-token", token);

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((p) => p.name === "productVendor1")).toBeTruthy();
      expect(res.body.some((p) => p.name === "productVendor2")).toBeTruthy();
    });
  });

  //////////////////////////////////////////////////////////////////////////////////////
  describe("GET /:id", () => {
    it("should return a productVendor if valid id is passed", async () => {
      const productVendor = new ProductVendor({ name: "productVendor1" });
      await productVendor.save();

      const res = await request(server)
        .get("/api/productvendor/" + productVendor._id)
        .set("x-auth-token", token);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", productVendor.name);
    });

    it("should return 404 if no productVendor with the given id exists", async () => {
      const id = mongoose.Types.ObjectId();
      const res = await request(server)
        .get("/api/productvendor/" + id)
        .set("x-auth-token", token);

      expect(res.status).toBe(404);
    });
  });

  ////////////////////////////////////////////////////////////////////////////////////
  describe("POST /", () => {
    let name;

    const exec = async () => {
      return await request(server)
        .post("/api/productvendor")
        .set("x-auth-token", token)
        .send({ name });
    };

    beforeEach(() => {
      name = "productvendor1";
    });

    it("should return 400 if productvendor name is empty", async () => {
      name = "";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if productvendor1 name is more than 255 characters", async () => {
      name = new Array(257).join("a");

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should save the productvendor1 if it is valid", async () => {
      const res = await exec();

      const productvendor = await ProductVendor.find({
        name: "productvendor1",
      });

      expect(res.status).toBe(200);
      expect(productvendor).not.toBeNull();
      expect(productvendor[0]).toHaveProperty("_id");
      expect(productvendor[0]).toHaveProperty("name");
    });
  });

  ////////////////////////////////////////////////////////////////////////////////
  describe("PUT /:id", () => {
    let newName;
    let productVendor;
    let id;

    const exec = async () => {
      return await request(server)
        .put("/api/productvendor/" + id)
        .set("x-auth-token", token)
        .send({ name: newName });
    };

    beforeEach(async () => {
      productVendor = new ProductVendor({
        name: "productVendor1",
      });
      await productVendor.save();

      id = productVendor._id;
      newName = "updatedName";
    });

    it("should return 400 if productVendor is empty", async () => {
      newName = "";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if productVendor is more than 255 characters", async () => {
      newName = new Array(257).join("a");

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 404 if productVendor with the given id was not found", async () => {
      id = mongoose.Types.ObjectId().toHexString();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should update the productVendor if input is valid", async () => {
      await exec();

      const updatedProductVendor = await ProductVendor.findById(
        productVendor._id
      );

      expect(updatedProductVendor.name).toBe(
        newName
          .split(" ")
          .map((v) => v[0].toUpperCase() + v.substring(1).toLowerCase())
          .join(" ")
      );
    });
  });

  //////////////////////////////////////////////////////////////////////////////////
  describe("DELETE /:id", () => {
    let productVendor;
    let id;

    const exec = async () => {
      return await request(server)
        .delete("/api/productvendor/" + id)
        .set("x-auth-token", token)
        .send();
    };

    beforeEach(async () => {
      productVendor = new ProductVendor({
        name: "productVendor1",
      });
      await productVendor.save();

      id = productVendor._id;
    });

    it("should return 404 if no productVendor with the given id was found", async () => {
      id = mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should delete the productVendor if input is valid", async () => {
      const res = await exec();

      const productVendorInDb = await ProductVendor.findById(id);

      expect(res.status).toBe(200);
      expect(productVendorInDb).toBeNull();
    });
  });
});
