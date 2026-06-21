// eslint-disable-next-line no-unused-vars
import React from "react";
import Dashboard from "./Dashboard";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div>
      hello user
      <Dashboard />
      <Outlet />
    </div>
  );
};

export default Layout;
