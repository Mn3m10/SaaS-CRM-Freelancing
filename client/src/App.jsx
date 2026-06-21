// eslint-disable-next-line no-unused-vars
import React from "react";
import Login from "./pages/login/Login";
import { Routes, Route } from "react-router-dom";
import Signup from "./pages/signup/Signup";
import { ToastContainer } from "react-toastify";
import Layout from "./layout/Layout";
import Dashboard from "./layout/Dashboard";

const App = () => {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/singup" element={<Signup />} />
        <Route path="/layout" element={<Layout />}>
          <Route index  element={<Dashboard />}/>
        </Route>
      </Routes>
    </>
  );
};

export default App;
