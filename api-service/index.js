import express from "express";
import amqp from "amqplib";

const app = express();
app.use(express.json());

app.post("/notify", async (req, res) => {
  try {
    const { type, to, subject, body } = req.body;

    const connect = await amqp.connect("amqp://localhost");
    const channel = await connect.createChannel();

    const exchangeName = "notification_system";
    await channel.assertExchange(exchangeName, "direct");

    channel.publish(
      exchangeName,
      type,
      Buffer.from(JSON.stringify({ type, to, subject, body }))
    );

    res.json({ status: "ok" });
  } catch (err) {
    console.error(err);
    res.json({ status: "error", msg: err.message });
  }
});

app.listen(3000, () => console.log("API service started"));
