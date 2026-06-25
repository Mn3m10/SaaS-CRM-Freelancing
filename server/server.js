import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import dns from "dns";
import cors from "cors";
import database from "./config/database.js";
import UserRouter from "./routes/UserRoute.js";
import AuthRouter from "./routes/AuthRoutes.js";
import ClientRouter from "./routes/ClientRoutes.js";
import ProjectRouter from "./routes/ProjectRoutes.js";
import TaskRouter from "./routes/TaskRoutes.js";
import InvoiceRouter from "./routes/InvoiceRoutes.js";
import DashboardRouter from "./routes/DashboardRoutes.js";
import GlobalErrorHandling from "./middlewares/GlobalErrorHandling.js";
import ApiError from "./errors/ApiError.js";
import qs from "qs";

dotenv.config();
dns.setServers(["1.1.1.1", "8.8.8.8"]);
database();

const app = express();
const PORT = process.env.PORT || 3000;

// Built-in Middlewares
app.use(express.json());
app.use("/images", express.static("images"));
app.use(cors()); // set connection between backend and frontend

// Read query parameters 
// GET /api/v1/endpoint?keyword=word&sort=field&page=num&limit=num&fields=field,field,...
app.set("query parser" , (str) => {
  return qs.parse(str , {
    allowDots: true,
    parseArrays: false,
  });
});

// morgan package
if(process.env.NODE_ENV === "dev") {
  app.use(morgan("dev"));
  console.log(`Project Mode : ${process.env.NODE_ENV}`);
}

// Routes
app.use("/api/v1/user", UserRouter);

app.use("/api/v1/auth", AuthRouter);

app.use("/api/v1/clients", ClientRouter);

app.use("/api/v1/projects" , ProjectRouter);

app.use("/api/v1/tasks" , TaskRouter);

app.use("/api/v1/invoices" , InvoiceRouter);

app.use("/api/v1/dashboard" , DashboardRouter);



// Handle Undefined Routes
app.use((req , res , next) => {
  next(new ApiError(`can't find this route ${req.originalUrl}` , 400));
})

// Global Error Handler
app.use(GlobalErrorHandling);

app.listen(PORT, () => {
  console.log(`The Server is running on http://localhost:${PORT}`);
});
