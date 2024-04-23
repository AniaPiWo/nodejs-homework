import supertest from "supertest";
import app from "../../app.js";
import { connectDB, disconnectDB } from "../../config/db.js";

describe("auth controller", () => {
  beforeAll(async () => {
    await connectDB();
  });

  test("database connection", async () => {
    const res = await supertest(app).get("/contacts").send();
    expect(res.statusCode).toEqual(200);
  });

  /*   test("signup", async () => {
    const res = await supertest(app)
      .post("/auth/signup")
      .send({
        email: "test@test.pl",
        password: "test",
        subscription: "pro",
      })
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");
    expect(res.statusCode).toEqual(201);
  }); */

  afterAll(async () => {
    await disconnectDB();
  });
});
