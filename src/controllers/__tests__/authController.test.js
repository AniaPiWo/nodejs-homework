import supertest from "supertest";
import app from "../../app";
import User from "../../models/userModel";
import { connectDB, disconnectDB } from "../../db.js";

describe("Auth controller test", () => {
  beforeAll(async () => {
    await connectDB();
  });

  test("signup", async () => {
    const email = `test-${Date.now()}@test.pl`;

    const userData = {
      email: email,
      password: "testPassword",
      subscription: "starter",
    };

    const res = await supertest(app)
      .post("/auth/signup")
      .send(userData)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");

    expect(res.statusCode).toEqual(201);

    expect(res.body).toEqual({ message: "User created" });

    const user = await User.findOne({ email: email });
    expect(user).toBeDefined();
    expect(user.email).toBe(userData.email);
    expect(user.subscription).toBe(userData.subscription);
    expect(user.avatarURL).toBeDefined();

    afterAll(async () => {
      await disconnectDB();
    });
  });

  test("login with valid credentials", async () => {
    const userData = {
      email: "test@example.com",
      password: "testPassword",
      subscription: "starter",
    };
    const newUser = new User(userData);
    await newUser.setPassword(userData.password);
    await newUser.save();

    const loginData = {
      email: userData.email,
      password: userData.password,
    };

    const response = await supertest(app)
      .post("/auth/login")
      .send(loginData)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");

    expect(response.statusCode).toEqual(200);
    expect(response.body).toHaveProperty("accessToken");
    expect(response.body).toHaveProperty("user");
    expect(response.body.user).toHaveProperty("email", userData.email);
    expect(response.body.user).toHaveProperty(
      "subscription",
      userData.subscription
    );
  });

  test("login with invalid email", async () => {
    const loginData = {
      email: "nonexistent@example.com",
      password: "testPassword",
    };
    const response = await supertest(app)
      .post("/auth/login")
      .send(loginData)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");

    expect(response.statusCode).toEqual(401);

    expect(response.body).toHaveProperty("message", "No such user");
  });

  test("login with invalid password", async () => {
    const userData = {
      email: "test@example.com",
      password: "testPassword",
      subscription: "starter",
    };
    const newUser = new User(userData);
    await newUser.setPassword(userData.password);
    await newUser.save();

    const loginData = {
      email: userData.email,
      password: "wrongPassword",
    };

    const response = await supertest(app)
      .post("/auth/login")
      .send(loginData)
      .set("Content-Type", "application/json")
      .set("Accept", "application/json");

    expect(response.statusCode).toEqual(401);

    expect(response.body).toHaveProperty("message", "Invalid password");
  });

  afterAll(async () => {
    await disconnectDB();
  });
});
