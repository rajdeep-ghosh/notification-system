import express from "express";
import amqp from "amqplib";

const app = express();
app.use(express.json());

const PORT = 6969;

app.post("/notify", async (req, res) => {
  try {
    const { type, to, subject, body } = req.body;

    const connect = await amqp.connect("amqp://ns-rabbitmq:5672");
    const channel = await connect.createChannel();

    const exchangeName = "notification_system";
    await channel.assertExchange(exchangeName, "direct");

    channel.publish(
      exchangeName,
      type,
      Buffer.from(JSON.stringify({ type, to, subject, body }))
    );

    console.log(`Task sent to queue of type ${type}`);

    res.json({ status: "ok" });
  } catch (err) {
    console.error(err);
    res.json({ status: "error", msg: err.message });
  }
});

app.listen(PORT, () => console.log(`API service started on port ${PORT}`));
