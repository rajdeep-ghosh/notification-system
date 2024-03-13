import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    status: String,
    message_id: String,
    type: String,
    to: String,
    subject: String,
    body: String,
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
