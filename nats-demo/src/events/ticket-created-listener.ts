import { Message } from "node-nats-streaming";
import { Listener } from "./base-listener";
import { TicketCreatedEvent } from "./ticket-created-event";
import { Subjects } from "./subjects";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  // We can extend the listener class to create a new listener class. And the abstract methods and properties
  // should be defined in the child class.
  // <TicketCreatedEvent> is a generic type constraint. As we've seen in the base-listener.ts file, the
  // subject property is of type T["subject"]. So we need to tell TS that the type of the subject property
  // defined in the TicketCreatedListener class will always be the same as the type of the subject property
  // defined in the TicketCreatedEvent interface.

  // subject = "ticket:created";
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
  // We need to add a type annotation to the subject property because typescript thinks that we might try
  // to change the value of the subject property with a wrong type of value in the future.

  // readonly subject = Subjects.TicketCreated;
  // We can also use the readonly keyword to tell TS that we will never change the value of the subject property.

  queueGroupName = "payments-service";

  onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    console.log("Event data!", data);

    // console.log(data.name);
    // console.log(data.cost);
    // The above will throw errors as data property onTicketCreatedEvent doesn't have name and cost properties.

    msg.ack();
  }
}
