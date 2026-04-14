const amqp = require("amqplib");

async function sendEvent(event) {
  const conn = await amqp.connect("amqp://rabbitmq");
  const ch = await conn.createChannel();

  await ch.assertQueue("events");

  ch.sendToQueue("events", Buffer.from(JSON.stringify(event)));
}

module.exports = sendEvent;