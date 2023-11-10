import nats from "node-nats-streaming";
import { TicketCreatedPublisher } from "./events/ticket-created-publisher";

console.clear();

const stan = nats.connect("ticketing", "abc", {
  url: "http://localhost:4222",
});

stan.on("connect", async () => {
  console.log("Publisher connected to NATS");

  const publisher = new TicketCreatedPublisher(stan);

  // As we've wrapped the publish method of the base-publisher.ts in a promise based implementation,
  // we can use async/await syntax when we call the publish method.
  await publisher.publish({
    id: "123",
    title: "concert",
    price: 20,
    // name: "sdf",
    // cost: 20,
    // name and cost properties will throw errors as they are not defined in the TicketCreatedEvent interface.
    // export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    //   subject: Subjects.TicketCreated = Subjects.TicketCreated;
    // }
    // The above code on ticket-created-publisher.ts enforces the TicketCreatedEvent interface
    // to have the properties id, title and price.
  });
});
