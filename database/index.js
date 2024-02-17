import mongoose from "mongoose";
import amqp from "amqplib";
import Notification from "./models/notification.js";

async function db() {
  await mongoose.connect("mongodb://localhost", {
    dbName: "notification_db",
  });

  const connection = await amqp.connect("amqp://localhost");
  const channel = await connection.createChannel();

  const dbq = await channel.assertQueue("db_queue", { durable: true });
  await channel.prefetch(1);

  console.log("DB service started");

  channel.consume(dbq.queue, async (msg) => {
    const task = JSON.parse(msg.content.toString());

    const newNotification = new Notification({ ...task });
    await newNotification.save();
    console.log("Saved to DB");

    channel.ack(msg);
  });
}

db().catch(console.error);
