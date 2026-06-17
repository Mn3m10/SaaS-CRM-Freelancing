import fs from "fs";
import path from "path";
import UserModel from "../models/UserModel.js";
import ClientModel from "../models/ClientModel.js";
import InvoiceModel from "../models/InvoiceModel.js";
import ProjectModel from "../models/ProjectModel.js";
import TaskModel from "../models/TaskModel.js";
import dotenv from "dotenv";
import database from "../config/database.js";
import dns from "dns";

dotenv.config({path: "../.env"});
dns.setServers(["1.1.1.1" , "8.8.8.8"]);
database();

const clients = JSON.parse(fs.readFileSync("./json/Clients.json"));
const projects = JSON.parse(fs.readFileSync("./json/Projects.json"));
const tasks = JSON.parse(fs.readFileSync("./json/Tasks.json"));
const invoices = JSON.parse(fs.readFileSync("./json/Invoices.json"));

const insertData = async(req , res) => {
  try {
    // await ClientModel.create(clients); 
    // await ProjectModel.create(projects);
    // await TaskModel.create(tasks);
    await InvoiceModel.create(invoices);
    console.log("data inserted successfully");
    process.exit();
  } catch(error) {
    console.log(error);
  }
}

const destroyData = async (req , res) => {
  try {
    // await InvoiceModel.deleteMany();
    // await ClientModel.deleteMany();
    // await ProjectModel.deleteMany();
    // await TaskModel.deleteMany();
    console.log("data deleted successfully!");
    process.exit();
  } catch(error) {
    console.log(error);
  }
}

if(process.argv[2] === '-i') {
  insertData();
} else if(process.argv[2] === '-d') {
  destroyData();
}