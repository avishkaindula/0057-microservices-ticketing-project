import request from "supertest";
import { app } from "../../app";
import mongoose from "mongoose";

it("returns a 404 if the ticket is not found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).get(`/api/tickets/${id}`).send().expect(404);
});
// It throws 400 bad request error instead of 404 not found.
// It happens because 123456789 is not a valid id. It should be a valid mongodb id.
// It's not something we defined as a custom error so it will be thrown as a 400 error
// of the errror handler middleware of the common package we created.

it("returns the ticket if the ticket is found", async () => {
  const title = "Valid title";
  const price = 20;

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({ title: "Valid title", price: price })
    .expect(201);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);

  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(price);
});
