// eslint-disable-next-line no-unused-vars
import React from "react";
import logo from "../../public/logo.png";
import { NavLink } from "react-router-dom";
import { MdOutlineDashboard } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { FaClipboardList } from "react-icons/fa";
import { MdChecklist } from "react-icons/md";
import { FaFileInvoice } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <aside className="sidebar">
      <div className="main">
        <div className="sidebar-header">
          <div className="logo">
            <img src={logo} alt="logo" width={50} />
          </div>
          <div className="text">
            <h2>Freelix</h2>
            <p>Freelancer Edition</p>
          </div>
        </div>
        <nav>
          <ul>
            <li>
              <NavLink to="dashboard">
                <MdOutlineDashboard /> Dashboard
              </NavLink>
            </li>

            <li>
              <NavLink to="clients">
                <FaUsers /> Clients
              </NavLink>
            </li>

            <li>
              <NavLink to="projects">
                <FaClipboardList /> Projects
              </NavLink>
            </li>

            <li>
              <NavLink to="tasks">
                <MdChecklist /> Tasks
              </NavLink>
            </li>

            <li>
              <NavLink to="invoices">
                <FaFileInvoice /> Invoices
              </NavLink>
            </li>

            <li>
              <NavLink to="profile">
                <FaUser />
                Profile
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
      <button
        onClick={() => navigate("projects/add-new-project")}
        className="new-proj-btn"
      >
        <span>+</span> Add New Project
      </button>
    </aside>
  );
};

export default Sidebar;
