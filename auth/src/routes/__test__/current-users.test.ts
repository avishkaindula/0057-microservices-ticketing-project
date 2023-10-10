import request from "supertest";
import { app } from "../../app";

it("responds with details about the current user", async () => {
  // await request(app)
  //   .post("/api/users/signup")
  //   .send({
  //     email: "test@test.com",
  //     password: "password",
  //   })
  //   .expect(201);

  // const response = await request(app)
  //   .get("/api/users/currentuser")
  //   .send()
  //   .expect(200);

  // console.log(response.body);
  // This outputs currentUser: null because in supertest, cookies are not saved between requests.

  // -------------------------------------------------------------------------------------------------
  // simple solution
  // const authResponse = await request(app)
  //   .post("/api/users/signup")
  //   .send({
  //     email: "test@test.com",
  //     password: "password",
  //   })
  //   .expect(201);

  // const cookie = authResponse.get("Set-Cookie");

  // const response = await request(app)
  //   .get("/api/users/currentuser")
  //   .set("Cookie", cookie) // set the cookie
  //   .send()
  //   .expect(200);

  // expect(response.body.currentUser.email).toEqual("test@test.com");

  // -------------------------------------------------------------------------------------------------
  // using global function
  const cookie = await global.signin();

  const response = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie) // set the cookie
    .send()
    .expect(200);

  expect(response.body.currentUser.email).toEqual("test@test.com");
});

it("responds with null if not authenticated", async () => {
  const response = await request(app)
    .get("/api/users/currentuser")
    .send()
    .expect(200);

  expect(response.body.currentUser).toEqual(null);
});
