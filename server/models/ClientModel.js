import mongoose from "mongoose";

const ClientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
  },
  company: String,
  notes: String,
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  }
} , {timestamps: true});

const ClientModel = mongoose.model("Client" , ClientSchema);

export default ClientModel;

