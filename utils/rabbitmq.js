const amqplib = require("amqplib")

let channel;

async function connectRabbitMQ() {
  if (channel) return channel;
  const conn = await amqplib.connect("amqp://localhost")
  channel = await conn.createChannel();
  console.log("Connection Started...")
  return channel;
}

module.exports = { connectRabbitMQ }
