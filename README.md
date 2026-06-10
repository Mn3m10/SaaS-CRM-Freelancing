# 🚀 Freelance CRM SaaS (Full Stack MERN Application)

A modern **Customer Relationship Management (CRM)** system built for freelancers and small businesses to efficiently manage clients, projects, tasks, and invoices in one place.

This is a full-stack application built using the **MERN stack (MongoDB, Express, React, Node.js)** with a focus on scalability, security, and clean architecture.

---

# 🧠 Project Overview

This CRM system helps freelancers:

- Manage clients and their information
- Organize projects per client
- Track tasks inside each project
- Generate and manage invoices
- Secure all data per authenticated user

Each user has a **fully isolated workspace**, meaning every freelancer sees only their own data.

---

# ⚙️ Tech Stack

## 🖥️ Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcrypt.js
- express-validator
- dotenv
- cors
- morgan

## 📌 Features

### 🔐 Authentication
- User Signup / Login
- JWT Authentication
- Protected Routes

### 🧑‍💼 CRM Core
- Users Managment (CRUD)
- Clients Management (CRUD)
- Projects Management (CRUD)
- Tasks Management (CRUD)
- Invoices Management (CRUD)

### ⚙️ System Features
- Input validation (express-validator)
- Centralized error handling
- Secure API with middleware authentication
- MongoDB relational structure using `ref` & `populate`
- Scalable modular architecture



## 🎨 Frontend
- React.js
- React Router DOM
- Axios
- Context API (State Management)
- Tailwind CSS / Bootstrap (UI styling)

## 🎨 Frontend Features

- ⚛️ React.js SPA (Single Page Application)
- 🔐 Login / Signup UI
- 📊 Dashboard for CRM overview
- 🧑‍💼 Clients management UI
- 📁 Projects management UI
- ✅ Tasks tracking interface
- 💰 Invoice creation and display
- 📱 Fully responsive design
- 🔄 API integration with backend using Axios
- 🔒 Protected routes (React Router)
