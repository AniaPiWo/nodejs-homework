import supertest from "supertest";
import db from "../../db.js";
import app from "../../app.js";
import User from "../../models/User.js";

describe("Auth controller", () => {
  beforeAll(() => {
    db.connect(process.env.DB_HOST);
  });

  test("create a user", async () => {
    const res = await supertest(app)
      .post("/auth/signup")
      .send({
        email: "test@jest.pl",
        password: "test",
        subscription: "starter",
      })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");

    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual({ message: "User created" });
  });
});
