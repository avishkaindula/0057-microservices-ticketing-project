import { Message } from "node-nats-streaming";
import { Listener } from "./base-listener";

export class TicketCreatedListener extends Listener {
  // We can extend the listener class to create a new listener class. And the abstract methods and properties
  // should be defined in the child class.
  subject = "ticket:created";

  queueGroupName = "payments-service";

  onMessage(data: any, msg: Message) {
    console.log("Event data!", data);

    msg.ack();
  }
}
