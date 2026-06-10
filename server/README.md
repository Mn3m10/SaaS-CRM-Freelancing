# 🚀 Freelance CRM SaaS (Full Stack)

A full-stack **CRM (Customer Relationship Management) system** built for freelancers and small teams to manage clients, projects, tasks, and invoices efficiently.

This project is built using the **MERN stack (MongoDB, Express, React, Node.js)** with a clean architecture, authentication system, and scalable backend design.

---

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

---

# 🖥️ Frontend (React)

The frontend is built using **React.js** to provide a modern and responsive user experience.

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

---

## 🧠 Frontend Architecture

```text
client/
│
├── src/
│   ├── components/      # Reusable UI components
│   ├── pages/           # Main pages (Dashboard, Clients, Projects...)
│   ├── services/        # API calls (Axios)
│   ├── context/         # Auth & global state
│   ├── hooks/           # Custom React hooks
│   ├── routes/          # Protected routes logic
│   └── App.js