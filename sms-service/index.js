import amqp from "amqplib";

async function consumer() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  const exchangeName = "notification_system";
  await channel.assertExchange(exchangeName, "direct");

  const q = await channel.assertQueue("sms_queue", { durable: true });
  await channel.bindQueue(q.queue, exchangeName, "sms");
  await channel.prefetch(1);

  console.log("SMS service started");

  channel.consume(q.queue, async (msg) => {
    const task = JSON.parse(msg.content.toString());

    // simulate sending sms
    await new Promise((resolve) => setTimeout(resolve, 4000));

    console.log(task);
    console.log("Task completed");

    channel.ack(msg);
  });
}

consumer().catch(console.error);
