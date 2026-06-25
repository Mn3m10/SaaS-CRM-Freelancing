import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 30,
    },
    description: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 50,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "overdue", "cancelld"],
      default: "pending",
    },
    deadline: {
      type: Date,
      required: true,
    },
    project: {
      type: mongoose.Schema.ObjectId,
      ref: "Project",
      required: true,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

const TaskModel = mongoose.model("Task", TaskSchema);

export default TaskModel;
