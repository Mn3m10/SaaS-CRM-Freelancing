import mongoose from "mongoose";

const TaskScheam = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 5,
    maxlength:20,
  },
  description: {
    type: String,
    required: true,
    minlength:10,
    maxlength:50,
  },
  status: {
    type: String,
    enum: ["pending" , "completed" , "overdue" , "cancelld"],
    default: "pending",
  },
  project: {
    type: mongoose.Schema.ObjectId,
    ref: "Project",
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  }
} , {timestamps: true});

const TaskModel = mongoose.model("Task" , TaskScheam);

export default TaskModel;

