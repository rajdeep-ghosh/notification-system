import amqp from "amqplib";
import { Resend } from "resend";

async function consumer() {
  const connection = await amqp.connect("amqp://ns-rabbitmq:5672");
  const channel = await connection.createChannel();

  const exchangeName = "notification_system";
  await channel.assertExchange(exchangeName, "direct");

  const emailq = await channel.assertQueue("email_queue", { durable: true });
  const dbq = await channel.assertQueue("db_queue", { durable: true });
  await channel.bindQueue(emailq.queue, exchangeName, "email");
  await channel.prefetch(1);

  console.log("Email service started");

  channel.consume(emailq.queue, async (msg) => {
    const task = JSON.parse(msg.content.toString());

    const resend = new Resend("re_fZUrRZ5S_LAYVJjEAjLXzEzjkGqiPj7Qv");
    const response = await resend.emails.send({
      from: "noreply@mail.rajdeepghosh.me",
      to: [task.to],
      subject: task.subject,
      text: task.body,
    });
    console.log(response.data ? "Task completed" : "Task failed");

    channel.sendToQueue(
      dbq.queue,
      Buffer.from(
        JSON.stringify({
          status: response.data ? "success" : "fail",
          message_id: response.data?.id,
          ...task,
        })
      )
    );

    channel.ack(msg);
  });
}

consumer().catch(console.error);
