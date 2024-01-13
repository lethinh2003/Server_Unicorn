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
    const { channel, connection } = await connectToRabbitMQ();

    // Publish message to queue
    const queue = "test-queue";
    const message = "Hello, Thinh Le";
    await channel.assertQueue(queue, {
      durable: true,
    });
    await channel.sendToQueue(queue, Buffer.from(message));
    console.log(`message sent: ${message}`);

    // Close the connection
    setTimeout(() => {
      connection.close();
    }, 500);
  } catch (err) {
    console.log(`Error connecting to RabbitMQ: `, err);
  }
};

runProducer();
