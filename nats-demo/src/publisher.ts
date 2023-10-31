import nats from 'node-nats-streaming';

console.clear();
// This will clear the console when we run the publisher.ts file

const stan = nats.connect('ticketing', 'abc', {
  url: 'http://localhost:4222',
});
// ticketing is the cluster id / name of the NATS streaming cluster
// 123 is the client id. The client id should be unique for all publisher and listener clients.
// stan is a name we give to the client
// As this is running inside kubernetes, we need to port forward the nats service
// kubectl port-forward nats-depl-5f6d6b8f7b-5xq4n 4222:4222
// This way, the requests coming from the outside world to localhost:4222 will be forwarded 
// to the nats service's port 4222
// (Or we can use ingress-nginx or a nodeport service to expose the nats service to the outside world. But
// port forwarding is the easiest way to do it.)

stan.on('connect', () => {
  console.log('Publisher connected to NATS');

  const data = JSON.stringify({
    id: '123',
    title: 'concert',
    price: 20,
  });
  // In NATS streaming server, we can only publish strings or buffers. So we need to convert the data to string
  // before publishing it. JSON are strings, so we can use JSON.stringify() to convert it to string.

  stan.publish('ticket:created', data, () => {
    console.log('Event published');
  });
  // ticket:created is the channel name. So now the NATS streaming server will create a channel named
  // ticket:created and publish the data to that channel.
  // The second argument is the data to be published
  // The third argument is a callback function that will be executed after the data is published.
});
