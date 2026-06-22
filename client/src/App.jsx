// eslint-disable-next-line no-unused-vars
import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Login from "./pages/login/Login";
import Signup from "./pages/signup/Signup";

import Layout from "./layout/Layout";

import Dashboard from "./pages/dashboard/Dashboard";

import Clients from "./pages/clients/Clients";
import AddClient from "./pages/clients/AddClient";

import Projects from "./pages/project/Projects";
import AddProject from "./pages/project/AddProject";

import Tasks from "./pages/tasks/Tasks";
import AddTask from "./pages/tasks/AddTask";

import Invoices from "./pages/invoices/Invoices";
import AddInvoice from "./pages/invoices/AddInvoice";

import Profile from "./pages/profile/Profile";

const App = () => {
  return (
    <>
      <ToastContainer />

      <Routes>
        {/* Authentication */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Dashboard Layout */}
        <Route path="/layout" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />

          {/* Clients */}
          <Route path="clients" element={<Clients />} />
          <Route path="clients/add-new-client" element={<AddClient />} />

          {/* Projects */}
          <Route path="projects" element={<Projects />} />
          <Route path="projects/add-new-project" element={<AddProject />} />

          {/* Tasks */}
          <Route path="tasks" element={<Tasks />} />
          <Route path="tasks/add-new-task" element={<AddTask />} />

          {/* Invoices */}
          <Route path="invoices" element={<Invoices />} />
          <Route path="invoices/add-new-invoice" element={<AddInvoice />} />

          {/* Profile */}
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
