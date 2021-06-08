const request = require("supertest");
const mongoose = require("mongoose");
const { User } = require("../../../models/user");

describe("/api/user", () => {
  let server;
  let token;
  let businessUnitId;
  let managerId;
  let pendingReportId;
  let userId;

  beforeEach(() => {
    server = require("../../../index");
    businessUnitId = mongoose.Types.ObjectId();
    managerId = mongoose.Types.ObjectId();
    pendingReportId = mongoose.Types.ObjectId();
    token = new User().generateAuthToken();
  });

  afterEach(async () => {
    await server.close();
    await User.deleteMany({});
  });

  ////////////////////////////////////////////////////////////////////////////////////
  describe("GET /", () => {
    it("should return all users", async () => {
      const users = [
        {
          name: "name name",
          businessUnit: businessUnitId,
          staffNumber: "a11",
          email: "kaizen.jakoby@fineoak.org",
          password: "P@55w0rd123",
          role: "manager",
          manager: managerId,
          userSignature: "userSignature",
          request: [pendingReportId],
        },
        {
          name: "name name2",
          businessUnit: businessUnitId,
          staffNumber: "a22",
          email: "nidish.osher@fineoak.org",
          password: "P@55w0rd123",
          role: "admin",
          manager: managerId,
          userSignature: "userSignature2",
          request: [pendingReportId],
        },
      ];

      await User.collection.insertMany(users);

      const res = await request(server)
        .get("/api/user")
        .set("x-auth-token", token);

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);

      expect(res.body.some((u) => u.name === users[0].name)).toBeTruthy();
      expect(
        res.body.some(
          (u) => u.businessUnit === users[0].businessUnit.toHexString()
        )
      ).toBeTruthy();
      expect(res.body.some((u) => u.email === users[0].email)).toBeTruthy();
      expect(res.body.some((u) => u.role === users[0].role)).toBeTruthy();
      expect(
        res.body.some((u) => u.manager === users[0].manager.toHexString())
      ).toBeTruthy();
      expect(
        res.body.some((u) => u.userSignature === users[0].userSignature)
      ).toBeTruthy();
      expect(
        res.body.some((u) => u.request[0] === users[0].request[0].toHexString())
      ).toBeTruthy();

      expect(res.body.some((u) => u.name === users[1].name)).toBeTruthy();
      expect(
        res.body.some(
          (u) => u.businessUnit === users[1].businessUnit.toHexString()
        )
      ).toBeTruthy();
      expect(res.body.some((u) => u.email === users[1].email)).toBeTruthy();
      expect(res.body.some((u) => u.role === users[1].role)).toBeTruthy();
      expect(
        res.body.some((u) => u.manager === users[1].manager.toHexString())
      ).toBeTruthy();
      expect(
        res.body.some((u) => u.userSignature === users[1].userSignature)
      ).toBeTruthy();
      expect(
        res.body.some((u) => u.request[0] === users[1].request[0].toHexString())
      ).toBeTruthy();
    });
  });

  //////////////////////////////////////////////////////////////////////////////////////
  describe("GET /:id", () => {
    it("should return a user if valid id is passed", async () => {
      const user = new User({
        name: "name name",
        businessUnit: businessUnitId,
        staffNumber: "a11",
        email: "kaizen.jakoby@fineoak.org",
        password: "P@55w0rd123",
        role: "manager",
        manager: managerId,
        userSignature: "userSignature",
        request: [pendingReportId],
      });
      await user.save();

      const res = await request(server)
        .get("/api/user/" + user._id)
        .set("x-auth-token", token);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", user.name);
      expect(res.body).toHaveProperty(
        "businessUnit",
        user.businessUnit.toHexString()
      );
      expect(res.body).toHaveProperty("staffNumber", user.staffNumber);
      expect(res.body).toHaveProperty("email", user.email);
      expect(res.body).toHaveProperty("password", user.password);
      expect(res.body).toHaveProperty("role", user.role);
      expect(res.body).toHaveProperty("manager", user.manager.toHexString());
      expect(res.body).toHaveProperty("userSignature", user.userSignature);
      expect(res.body).toHaveProperty(
        "request",
        expect.arrayContaining([user.request[0].toHexString()])
      );
    });

    it("should return 404 if no user with the given id exists", async () => {
      const id = mongoose.Types.ObjectId();
      const res = await request(server)
        .get("/api/user/" + id)
        .set("x-auth-token", token);

      expect(res.status).toBe(404);
    });
  });

  ////////////////////////////////////////////////////////////////////////////////////
  describe("GET /manager", () => {
    beforeEach(() => {
      token = new User({ role: "admin" }).generateAuthToken();
    });

    it("should return a manager role user", async () => {
      const users = [
        {
          name: "name name",
          businessUnit: businessUnitId,
          staffNumber: "a11",
          email: "kaizen.jakoby@fineoak.org",
          password: "P@55w0rd123",
          role: "manager",
          manager: managerId,
          userSignature: "userSignature",
          request: [pendingReportId],
        },
        {
          name: "name name2",
          businessUnit: businessUnitId,
          staffNumber: "a22",
          email: "nidish.osher@fineoak.org",
          password: "P@55w0rd123",
          role: "admin",
          manager: managerId,
          userSignature: "userSignature2",
          request: [pendingReportId],
        },
      ];

      await User.collection.insertMany(users);

      const res = await request(server)
        .get("/api/user/manager")
        .set("x-auth-token", token);

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
    });
  });

  describe("GET /:me", () => {
    beforeEach(() => {
      userId = mongoose.Types.ObjectId();
      token = new User({ _id: userId }).generateAuthToken();
    });

    it("should return the initiator user detail", async () => {
      const user = new User({
        _id: userId,
        name: "name name",
        businessUnit: businessUnitId,
        staffNumber: "a11",
        email: "kaizen.jakoby@fineoak.org",
        password: "P@55w0rd123",
        role: "manager",
        manager: managerId,
        userSignature: "userSignature",
        request: [pendingReportId],
      });
      await user.save();

      const res = await request(server)
        .get("/api/user/me")
        .set("x-auth-token", token);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", user.name);
      expect(res.body).toHaveProperty(
        "businessUnit",
        user.businessUnit.toHexString()
      );
      expect(res.body).toHaveProperty("staffNumber", user.staffNumber);
      expect(res.body).toHaveProperty("email", user.email);
      expect(res.body).toHaveProperty("password", user.password);
      expect(res.body).toHaveProperty("role", user.role);
      expect(res.body).toHaveProperty("manager", user.manager.toHexString());
      expect(res.body).toHaveProperty("userSignature", user.userSignature);
      expect(res.body).toHaveProperty(
        "request",
        expect.arrayContaining([user.request[0].toHexString()])
      );
    });
  });

  ////////////////////////////////////////////////////////////////////////////////////
  describe("POST /", () => {
    const exec = async () => {
      return await request(server)
        .post("/api/user")
        .set("x-auth-token", token)
        .send({
          name,
          businessUnit,
          staffNumber,
          email,
          password,
          rep_pass,
          role,
          managerId,
          userSignature,
          request: requestArr,
        });
    };

    beforeEach(async () => {
      token = new User({ role: "admin" }).generateAuthToken();
      {
        name = "name name1";
        businessUnit = businessUnitId;
        staffNumber = "a11";
        email = "kaizen.jakoby@fineoak.org";
        password = "P@55w0rd123";
        rep_pass = "P@55w0rd123";
        role = "user";
        managerId = managerId;
        userSignature = "userSignature2";
        requestArr = [pendingReportId];
      }
    });

    it("should return 400 if user name is less then 3 characters", async () => {
      name = new Array(2).join("a");

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if user name is more than 255 characters", async () => {
      name = new Array(257).join("a");

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if businessUnit is empty", async () => {
      businessUnit = "";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if user businessUnit id is invalid", async () => {
      businessUnit = "a";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if user staffNumber is less then 3 characters", async () => {
      staffNumber = new Array(2).join("a");

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if user staffNumber is more than 255 characters", async () => {
      staffNumber = new Array(257).join("a");

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if user email is empty", async () => {
      email = "";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if user email is invalid", async () => {
      email = "testguest.com";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if user role is not `user`, `manager` or `admin`", async () => {
      role = "a";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if user managerId id is invalid", async () => {
      managerId = "a";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if user password less than 10 characters", async () => {
      password = "P@55w0rd";
      rep_pass = "P@55w0rd";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if user password more than 255 characters", async () => {
      password = "P@55w0rd123" + new Array(257).join("a");
      rep_pass = "P@55w0rd123" + new Array(257).join("a");

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if user password there is no lowercase", async () => {
      password = "P@55W0RD123";
      rep_pass = "P@55W0RD123";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if user password there is no higher", async () => {
      password = "p@55w0rd123";
      rep_pass = "p@55w0rd123";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if user password there is no numeric", async () => {
      password = "p@aawardaaa";
      rep_pass = "p@aawardaaa";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if user password there is no symbol", async () => {
      password = "pa55w0rd123";
      rep_pass = "pa55w0rd123";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if user password and rep_pass is not the same", async () => {
      rep_pass = "pa55w0rd123";
      password = "pa55w0rd321";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should save the user if it is valid", async () => {
      let manager = new User({
        _id: managerId,
        name: "name name2",
        businessUnit: businessUnitId,
        staffNumber: "a22",
        email: "ilyas.deric@fineoak.org",
        password: "P@55w0rd123",
        rep_pass: "P@55w0rd123",
        role: "manager",
        userSignature: "userSignature2",
      });
      await manager.save();

      const res = await exec();

      const user = await User.find({
        name: "name name2",
      });

      expect(res.status).toBe(200);
      expect(user).not.toBeNull();
      expect(user[0]).toHaveProperty("_id");
      expect(user[0]).toHaveProperty("name");
      expect(user[0]).toHaveProperty("businessUnit");
      expect(user[0]).toHaveProperty("staffNumber");
      expect(user[0]).toHaveProperty("email");
      expect(user[0]).toHaveProperty("password");
      expect(user[0]).toHaveProperty("role");
      expect(user[0]).toHaveProperty("manager");
      expect(user[0]).toHaveProperty("userSignature");
      expect(user[0]).toHaveProperty("request");
    });
  });

  //   ////////////////////////////////////////////////////////////////////////////////////
  //   describe("PUT /:id", () => {
  //     let newName;
  //     let newBusinessUnit;
  //     let newStaffNumber;
  //     let newEmail;
  //     let newPassword;
  //     let newRep_pass;
  //     let newRole;
  //     let newUserSignature;
  //     let id;

  //     const exec = async () => {
  //       return await request(server)
  //         .put("/api/user/" + id)
  //         .set("x-auth-token", token)
  //         .send({
  //           name: newName,
  //           businessUnit: newBusinessUnit,
  //           staffNumber: newBusinessUnit,
  //           email: newEmail,
  //           password: newPassword,
  //           rep_pass: newRep_pass,
  //           role: newRole,
  //           userSignature: newUserSignature,
  //         });
  //     };

  //     beforeEach(async () => {
  //       token = new User({ role: "admin" }).generateAuthToken();
  //       user = new User({
  //         name: "name name2",
  //         businessUnit: businessUnitId,
  //         staffNumber: "a22",
  //         email: "kaizen.jakoby@fineoak.org",
  //         password: "P@55w0rd123",
  //         rep_pass: "P@55w0rd123",
  //         role: "manager",
  //         userSignature: "userSignature2",
  //       });
  //       await user.save();

  //       id = user._id;
  //       newName = "updatedName";
  //       newBusinessUnit = mongoose.Types.ObjectId();
  //       newStaffNumber = "a1";
  //       newEmail = "ilyas.deric@fineoak.org";
  //       newPassword = "P@55w0rd132";
  //       newRep_pass = "P@55w0rd132";
  //       newRole = "admin";
  //       newUserSignature = "userSignature1";
  //     });

  //     it("should return 400 if user name is less then 3 characters", async () => {
  //       name = new Array(2).join("a");

  //       const res = await exec();

  //       expect(res.status).toBe(400);
  //     });

  //     it("should return 400 if user name is more than 255 characters", async () => {
  //       name = new Array(257).join("a");

  //       const res = await exec();

  //       expect(res.status).toBe(400);
  //     });

  //     it("should return 400 if businessUnit is empty", async () => {
  //       businessUnit = "";

  //       const res = await exec();

  //       expect(res.status).toBe(400);
  //     });

  //     it("should return 400 if user businessUnit id is invalid", async () => {
  //       businessUnit = "a";

  //       const res = await exec();

  //       expect(res.status).toBe(400);
  //     });

  //     it("should return 400 if user staffNumber is less then 3 characters", async () => {
  //       staffNumber = new Array(5).join("a");

  //       const res = await exec();

  //       expect(res.status).toBe(400);
  //     });

  //     it("should return 400 if user staffNumber is more than 255 characters", async () => {
  //       staffNumber = new Array(257).join("a");

  //       const res = await exec();

  //       expect(res.status).toBe(400);
  //     });

  //     it("should return 400 if user email is empty", async () => {
  //       email = "";

  //       const res = await exec();

  //       expect(res.status).toBe(400);
  //     });

  //     it("should return 400 if user email is invalid", async () => {
  //       email = "testguest.com";

  //       const res = await exec();

  //       expect(res.status).toBe(400);
  //     });

  //     it("should return 400 if user role is not `user`, `manager` or `admin`", async () => {
  //       role = "a";

  //       const res = await exec();

  //       expect(res.status).toBe(400);
  //     });

  //     it("should return 400 if user managerId id is invalid", async () => {
  //       managerId = "a";

  //       const res = await exec();

  //       expect(res.status).toBe(400);
  //     });

  //     it("should return 400 if user password less than 10 characters", async () => {
  //       password = "P@55w0rd";

  //       const res = await exec();

  //       expect(res.status).toBe(400);
  //     });

  //     it("should return 400 if user password more than 255 characters", async () => {
  //       password = "P@55w0rd123" + new Array(257).join("a");

  //       const res = await exec();

  //       expect(res.status).toBe(400);
  //     });

  //     it("should return 400 if user password there is no lowercase", async () => {
  //       password = "P@55W0RD123";

  //       const res = await exec();

  //       expect(res.status).toBe(400);
  //     });

  //     it("should return 400 if user password there is no higher", async () => {
  //       password = "p@55w0rd123";

  //       const res = await exec();

  //       expect(res.status).toBe(400);
  //     });

  //     it("should return 400 if user password there is no numeric", async () => {
  //       password = "p@aawardaaa";

  //       const res = await exec();

  //       expect(res.status).toBe(400);
  //     });

  //     it("should return 400 if user password there is no symbol", async () => {
  //       password = "pa55w0rd123";

  //       const res = await exec();

  //       expect(res.status).toBe(400);
  //     });

  //     it("should return 400 if user rep_pass less than 10 characters", async () => {
  //       rep_pass = "P@55w0rd";

  //       const res = await exec();

  //       expect(res.status).toBe(400);
  //     });

  //     it("should return 400 if user rep_pass more than 255 characters", async () => {
  //       rep_pass = "P@55w0rd123" + new Array(257).join("a");

  //       const res = await exec();

  //       expect(res.status).toBe(400);
  //     });

  //     it("should return 400 if user rep_pass there is no lowercase", async () => {
  //       rep_pass = "P@55W0RD123";

  //       const res = await exec();

  //       expect(res.status).toBe(400);
  //     });

  //     it("should return 400 if user rep_pass there is no higher", async () => {
  //       rep_pass = "p@55w0rd123";

  //       const res = await exec();

  //       expect(res.status).toBe(400);
  //     });

  //     it("should return 400 if user rep_pass there is no numeric", async () => {
  //       rep_pass = "p@aawardaaa";

  //       const res = await exec();

  //       expect(res.status).toBe(400);
  //     });

  //     it("should return 400 if user rep_pass there is no symbol", async () => {
  //       rep_pass = "pa55w0rd123";

  //       const res = await exec();

  //       expect(res.status).toBe(400);
  //     });

  //     it("should return 400 if user password and rep_pass is not the same", async () => {
  //       rep_pass = "pa55w0rd123";
  //       password = "pa55w0rd321";

  //       const res = await exec();

  //       expect(res.status).toBe(400);
  //     });

  //     it("should update the user if input is valid", async () => {
  //       const res = await exec();

  //       const updateduser = await User.findById(user._id);

  //       expect(res.status).toBe(200);
  //       //   expect(updateduser.name).toBe(
  //       //     newName
  //       //       .split(" ")
  //       //       .map((v) => v[0].toUpperCase() + v.substring(1).toLowerCase())
  //       //       .join(" ")
  //       //   );
  //       // expect(updateduser.description).toBe(newDescription);
  //     });
  //   });
  // });
  ////////////////////////////////////////////////////////////////////////////////
  describe("DELETE /:id", () => {
    let user;
    let id;

    const exec = async () => {
      return await request(server)
        .delete("/api/user/" + id)
        .set("x-auth-token", token)
        .send();
    };

    beforeEach(async () => {
      token = new User({ role: "admin" }).generateAuthToken();

      user = new User({
        name: "name name2",
        businessUnit: businessUnitId,
        staffNumber: "a22",
        email: "kaizen.jakoby@fineoak.org",
        password: "P@55w0rd123",
        rep_pass: "P@55w0rd123",
        role: "manager",
        userSignature: "userSignature2",
      });
      await user.save();

      id = user._id;
    });

    it("should return 404 if no user with the given id was found", async () => {
      id = mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should delete the user if input is valid", async () => {
      const res = await exec();

      const userInDb = await User.findById(id);

      expect(res.status).toBe(200);
      expect(userInDb).toBeNull();
    });
  });
});
