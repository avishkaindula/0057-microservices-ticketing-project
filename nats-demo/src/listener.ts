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

  stan.on("close", () => {
    console.log("NATS connection closed!");
    process.exit();
    // This will close the listener when the NATS streaming server is closed
  });

  const options = stan
    .subscriptionOptions()
    .setManualAckMode(true)
    .setDeliverAllAvailable()
    .setDurableName("accounting-service");
  // We can set some options for the subscription. We can use the subscriptionOptions() method to set the options.
  // The setManualAckMode() method will set the manual acknowledgement mode to true. By default, the manual
  // acknowledgement mode is false. When the manual acknowledgement mode is false, then the NATS streaming server
  // will automatically send an acknowledgement to the publisher when the message is received by the listener.
  // But when the manual acknowledgement mode is true, then the listener will have to manually send an
  // acknowledgement to the NATS streaming server when the message is received by the listener. If the listener
  // does not send an acknowledgement to the NATS streaming server, then the NATS streaming server will assume
  // that the message was not received by the listener and will send the message to another listener.
  // setDeliverAllAvailable() will tell the NATS streaming server to send all the messages that were published
  // to the channel in the past to the listener.
  // setDurableName() will tell the NATS streaming server to keep track of the messages that were sent to the
  // listener. So if the listener goes offline for some time and then comes back online, then the NATS streaming
  // server will send the messages that were sent to the listener when it was offline to the listener. We need to
  // add this because if we haven't add this, setDeliverAllAvailable() will send all the messages that were published
  // to the channel in the past to the listener. The previous messages will might have already been processed by
  // the listener. So there's no need to reprocess them. That's why we need to add setDurableName(). But in order
  // to use setDurableName() as expected, we should always have a queue group inside the subscription() method.
  // (orders-service-queue-group)

  const subscription = stan.subscribe(
    "ticket:created",
    "orders-service-queue-group",
    options
  );
  // The first argument is the channel name to subscribe to.
  // The second argument is the queue group name. If we don't provide a queue group name, then the NATS
  // streaming server will send the message to all the copies of the listeners that are subscribed to that channel. But
  // if we provide a queue group name, then the NATS streaming server will send the message to only one copy of the
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

    msg.ack();
    // This will send an acknowledgement to the NATS streaming server that the message was received by the listener.
    // If we don't send an acknowledgement to the NATS streaming server, then the NATS streaming server will
    // assume that the message was not received by the listener and will send the message to another copy of the listener or
    // to the same listener again after like 30 seconds. This is useful because if for some reason, some code
    // before the msg.ack() line throws an error and return, then the message will not be acknowledged in msg.ack() and the NATS streaming
    // server will send the message to another copy of the listener or to the same listener again after like 30 seconds.
  });
  // The second argument is a callback function that will be executed when a message is received
});

process.on("SIGINT", () => stan.close());
// This will close the listener when we press ctrl + c
process.on("SIGTERM", () => stan.close());
// This will close the listener when we press ctrl + c
// The above two lines are used to close the listener when we press ctrl + c. (OR rs in the terminal. rs will restart the terminal.)
// If we don't do that, then the listener will not close properly and the NATS streaming server will think that the listener is still
// connected to the NATS streaming server and will send the messages to the listener. But the listener is not running anymore.

abstract class Listener {
  // We don't define abstract methods inside an abstract class. We just define the method signature.
  // We will define the method body in the child class. So what we define in abstract class is
  //  more like a blueprint for the child class.
  // Abstract properties are also defined in the same way.
  abstract subject: string;
  abstract queueGroupName: string;
  abstract onMessage(data: any, msg: Message): void;
  // This is the callback function that will be executed when a message is received from the publisher
  private client: nats.Stan;
  protected ackWait = 5 * 1000;

  constructor(client: nats.Stan) {
    this.client = client;
  }
  // This constructor will be called when we create a new instance of the listener class. We will pass the client
  // to the constructor.

  subscriptionOptions() {
    return this.client
      .subscriptionOptions()
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroupName);
    // We can set some options for the subscription. We can use the subscriptionOptions() method to set the options.
  }

  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    );
    // The first argument is the channel name to subscribe to.
    // The second argument is the queue group name. If we don't provide a queue group name, then the NATS
    // streaming server will send the message to all the copies of the listeners that are subscribed to that channel. But
    // if we provide a queue group name, then the NATS streaming server will send the message to only one copy of the
    // listener that is subscribed to that channel. It will load balance the messages between all the listeners
    // that are subscribed to that channel.

    subscription.on("message", (msg: Message) => {
      // Now whenever a message is received from the publisher, this callback function will be executed
      // We can see inside the type definition of the Message class to see the available methods
      console.log(`Message received: ${this.subject} / ${this.queueGroupName}`);
      // This will log the channel name and the queue group name to the console when a message is received from the publisher

      const parsedData = this.parseMessage(msg);
      // This will parse the message and return the parsed data

      this.onMessage(parsedData, msg);
      // This will call the onMessage() method with the parsed data and the message
    });
  }

  parseMessage(msg: Message) {
    const data = msg.getData();
    // msg.getData() will return the data that was published by the publisher

    return typeof data === "string"
      ? JSON.parse(data)
      : JSON.parse(data.toString("utf8"));
  }
  // This method will parse the message and return the parsed data
}
