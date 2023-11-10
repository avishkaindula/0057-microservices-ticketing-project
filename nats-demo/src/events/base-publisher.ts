import { Stan } from "node-nats-streaming";
import { Subjects } from "./subjects";

interface Event {
  subject: Subjects;
  data: any;
  // Here we are using the any type for the data property because we don't know
  // what type of data will be published with the event. We will define the
  // structure of the data in the interface of the child class event.
}

export abstract class Publisher<T extends Event> {
  // <T extends Event> is a generic type constraint. It is a way to tell TS that
  // the type of the subject property defined in classes that extends Publisher will always
  // be the same as the type of the subject property defined in the Event interface.
  abstract subject: T["subject"];
  private client: Stan;

  constructor(client: Stan) {
    this.client = client;
  }

  publish(data: T["data"]): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.publish(this.subject, JSON.stringify(data), (err) => {
        if (err) {
          reject(err);
        }
        console.log("Event published to subject", this.subject);
        resolve();
      });
    });
    // The above code is a promise based implementation of the publish method.
    // The publish method of the node-nats-streaming library is a callback based
    // implementation. We are wrapping the callback based implementation in a
    // promise based implementation so that we can use async/await syntax when
    // we call the publish method. resolve() is called when the event is
    // published successfully. reject() is called when there is an error
    // publishing the event.
  }
}
