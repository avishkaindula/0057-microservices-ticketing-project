import { Message, Stan } from "node-nats-streaming";

export abstract class Listener {
  // We don't define abstract methods inside an abstract class. We just define the method signature.
  // We will define the method body in the child class. So what we define in abstract class is
  //  more like a blueprint for the child class.
  // Abstract properties are also defined in the same way.
  abstract subject: string;
  abstract queueGroupName: string;
  abstract onMessage(data: any, msg: Message): void;
  // This is the callback function that will be executed when a message is received from the publisher
  private client: Stan;
  protected ackWait = 5 * 1000;

  constructor(client: Stan) {
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

  parseMessage(msg: Message) {
    const data = msg.getData();
    // msg.getData() will return the data that was published by the publisher

    return typeof data === "string"
      ? JSON.parse(data)
      : JSON.parse(data.toString("utf8"));
  }
  // This method will parse the message and return the parsed data

  listen() {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroupName,
      this.subscriptionOptions()
    );

    subscription.on("message", (msg: Message) => {
      console.log(`Message received: ${this.subject} / ${this.queueGroupName}`);

      const parsedData = this.parseMessage(msg);

      this.onMessage(parsedData, msg);
    });
  }
  // This listen() method is the main method that will be called when we create a new instance of the listener class.
}
