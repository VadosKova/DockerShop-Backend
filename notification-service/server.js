const amqp = require("amqplib");

async function start() {
  try {
    console.log("Connecting to RabbitMQ...");

    const conn = await amqp.connect("amqp://rabbitmq");
    const ch = await conn.createChannel();

    await ch.assertQueue("events");

    console.log("Notification service started");

    ch.consume("events", (msg) => {
      const event = JSON.parse(msg.content.toString());

      switch (event.type) {
        case "order.created":
          console.log(`Email: Order created for user ${event.userId}`);
          break;

        case "order.status":
          console.log(`Email: Order ${event.orderId} status = ${event.status}`);
          break;

        default:
          console.log("Unknown event:", event);
      }

      ch.ack(msg);
    });

  } catch (error) {
    console.log("RabbitMQ not ready, retry later...");
    setTimeout(start, 5000);
  }
}

start();