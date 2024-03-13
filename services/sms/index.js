import amqp from "amqplib";

async function consumer() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  const exchangeName = "notification_system";
  await channel.assertExchange(exchangeName, "direct");

  const smsq = await channel.assertQueue("sms_queue", { durable: true });
  const dbq = await channel.assertQueue("db_queue", { durable: true });
  await channel.bindQueue(smsq.queue, exchangeName, "sms");
  await channel.prefetch(1);

  console.log("SMS service started");

  channel.consume(smsq.queue, async (msg) => {
    const task = JSON.parse(msg.content.toString());

    // simulate sending sms
    await new Promise((resolve) => setTimeout(resolve, 4000));
    console.log("Task failed");

    channel.sendToQueue(
      dbq.queue,
      Buffer.from(
        JSON.stringify({
          status: "fail",
          message_id: null,
          ...task,
        })
      )
    );

    channel.ack(msg);
  });
}

consumer().catch(console.error);
