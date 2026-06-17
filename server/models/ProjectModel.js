import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
  title : {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  description: {
    type: String,
    required: true,
    minlength: 10,
    maxlength: 100,
  },
  status: {
    type: String,
    enum: ["pending" , "completed" , "overdue" , "cancelld"],
    default: "pending",
  },
  deadline: Date,
  client: {
    type: mongoose.Schema.ObjectId,
    ref: "Client",
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true
  }
})

const ProjectModel = mongoose.model("Project" , ProjectSchema);

export default ProjectModel;