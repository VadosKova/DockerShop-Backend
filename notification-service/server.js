const amqp = require("amqplib");

async function start() {
  const conn = await amqp.connect("amqp://rabbitmq");
  const ch = await conn.createChannel();

  await ch.assertQueue("orders");

  console.log("Notification service started");

  ch.consume("orders", (msg) => {
    const data = JSON.parse(msg.content.toString());

    console.log("EVENT:", data);

    ch.ack(msg);
  });
}

start();