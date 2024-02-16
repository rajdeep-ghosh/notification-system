import amqp from "amqplib";
import { Resend } from "resend";

async function consumer() {
  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  const exchangeName = "notification_system";
  await channel.assertExchange(exchangeName, "direct");

  const q = await channel.assertQueue("email_queue", { durable: true });
  await channel.bindQueue(q.queue, exchangeName, "email");
  await channel.prefetch(1);

  channel.consume(q.queue, async (msg) => {
    const task = JSON.parse(msg.content.toString());

    const resend = new Resend("re_fZUrRZ5S_LAYVJjEAjLXzEzjkGqiPj7Qv");
    const response = await resend.emails.send({
      from: "noreply@mail.rajdeepghosh.me",
      to: [task.to],
      subject: task.subject,
      text: task.body,
    });

    console.log(response);
    console.log("Task completed");

    channel.ack(msg);
  });
}

consumer().catch(console.error);
