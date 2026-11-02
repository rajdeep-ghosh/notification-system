import mongoose from "mongoose";

export interface INotification {
  status: "success" | "fail";
  message_id?: string | null;
  type: string;
  to: string;
  subject: string;
  body: string;
}

const notificationSchema = new mongoose.Schema<INotification>(
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

const Notification = mongoose.model<INotification>(
  "Notification",
  notificationSchema
);

export default Notification;
