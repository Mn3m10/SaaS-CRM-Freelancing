import mongoose from "mongoose";

const InvoiceSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },
    invoiceNumber: {
      type: "String",
      required: true,
      unique: true,
    },
    status: {
      type: "String",
      enum: ["pending", "paid", "overdue", "cancelled"],
      default: "pending",
    },
    dueDate: {
      type: Date,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    client: {
      type: mongoose.Schema.ObjectId,
      ref: "Client",
      required: true,
    },
    project: {
      type: mongoose.Schema.ObjectId,
      ref: "Project",
      required: true,
    }
  },
  { timestamps: true },
);

const InvoiceModel = mongoose.model("Invoice" , InvoiceSchema);

export default InvoiceModel;