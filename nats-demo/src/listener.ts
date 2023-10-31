import nats, { Message } from "node-nats-streaming";
import { randomBytes } from "crypto";

console.clear();

const stan = nats.connect("ticketing", randomBytes(4).toString("hex"), {
  // If we try to open a second terminal and run the listener.ts file, we will see that the second listener
  // will not receive the event. This is because the second listener is using the same client id as the first
  // listener. So the second listener will not be able to connect to the NATS streaming server. To fix this,
  // we can generate a random client id for each listener. We can use the randomBytes() function from the
  // crypto module to generate a random string.
  url: "http://localhost:4222",
});

stan.on("connect", () => {
  console.log("Listener connected to NATS");

  const subscription = stan.subscribe(
    "ticket:created",
    "orders-service-queue-group"
  );
  // The first argument is the channel name to subscribe to.
  // The second argument is the queue group name. If we don't provide a queue group name, then the NATS
  // streaming server will send the message to all the listeners that are subscribed to that channel. But
  // if we provide a queue group name, then the NATS streaming server will send the message to only one
  // listener that is subscribed to that channel. It will load balance the messages between all the listeners
  // that are subscribed to that channel.

  subscription.on("message", (msg: Message) => {
    // Now whenever a message is received from the publisher, this callback function will be executed
    // We can see inside the type definition of the Message class to see the available methods
    const data = msg.getData();
    // msg.getData() will return the data that was published by the publisher

    if (typeof data === "string") {
      console.log(`Received event #${msg.getSequence()}, with data: ${data}`);
    }
    // msg.getSequence() will return the sequence number of the message. It's a auto incrementing number
    // that is assigned to each message that is published to the channel starting from 1.
  });
  // The second argument is a callback function that will be executed when a message is received
});
