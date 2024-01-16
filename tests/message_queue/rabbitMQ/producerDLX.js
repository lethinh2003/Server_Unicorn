"use strict";
const amqp = require("amqplib");

const connectToRabbitMQ = async () => {
  try {
    const connection = await amqp.connect("amqp://guest:guest@localhost");
    if (!connection) {
      throw new Error("Connection not established");
    }
    const channel = await connection.createChannel();

    return { channel, connection };
  } catch (err) {
    console.log(`Error connecting to RabbitMQ: `, err);
  }
};

const runProducer = async () => {
  try {
    const connection = await amqp.connect("amqp://guest:guest@localhost");
    const channel = await connection.createChannel();

    const exchange = "exchangeTL";
    const queue = "queueTL";
    const exchangeDLX = "exchangeDLXexchangeDLX";
    const routingKeyDLX = "routingKeyDLX";
    await channel.assertExchange(exchange, "direct", {
      durable: true,
    });

    const queueResult = await channel.assertQueue(queue, {
      exclusive: false,
      deadLetterExchange: exchangeDLX,
      deadLetterRoutingKey: routingKeyDLX,
    });

    await channel.bindQueue(queueResult.queue, exchange);

    for (let i = 1; i <= 10; i++) {
      const message = "Hello, Thinh Le " + i;
      console.log(`message sent: ${message}`);
      channel.sendToQueue(queue, Buffer.from(message));
    }

    // Close the connection
    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (err) {
    console.log(`Error connecting to RabbitMQ: `, err);
  }
};

runProducer();
