// eslint-disable-next-line no-unused-vars
import React from "react";
import { Outlet } from "react-router-dom";
import "./Layout.css";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const Layout = () => {
  return (
    <main className="layout">
      <Sidebar />
      <Navbar />
      <div className="outlet">
        <Outlet />
      </div>
    </main>
  );
};

export default Layout;
