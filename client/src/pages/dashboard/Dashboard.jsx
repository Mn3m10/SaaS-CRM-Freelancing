/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import DashboardBox from "../../components/DashboardBox";
import { FaUsers } from "react-icons/fa";
import { FaClipboardList } from "react-icons/fa";
import { MdChecklist } from "react-icons/md";
import { FaMoneyBillAlt } from "react-icons/fa";
import DashboardGraph from "../../components/DashboardGraph";
import DashboardTasks from "../../components/DashboardTasks";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalClients: 0,
    totalProjects: 0,
    totalTasks: 0,
    totalInvoices: 0,
    completedTasks: 0,
    pendingTasks: 0,
    overdueTasks: 0,
    completedProjects: 0,
    pendingProjects: 0,
    totalRevenue: 0,
    pendingPayments: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/v1/dashboard", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await response.json();
        if (result?.data) {
          setDashboardData(result.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    getDashboardData();
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value || 0);
  };

  return (
    <section className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <div className="text">
            <h1>Analytics Overview</h1>
            <p>Your performance and operational health at a glance.</p>
          </div>
          <div className="dashboard-btns">
            <button>Last 30 days</button>
            <button>Export PDF</button>
          </div>
        </div>

        <div className="dashbaord-numbers">
          <DashboardBox
            icon={<FaUsers />}
            title="TOTAL CLIENTS"
            number={dashboardData.totalClients}
            info="Total registered clients"
          />
          <DashboardBox
            icon={<FaClipboardList />}
            title="TOTAL PROJECTS"
            number={dashboardData.totalProjects}
            info={`${dashboardData.completedProjects} completed, ${dashboardData.pendingProjects} pending`}
          />
          <DashboardBox
            icon={<MdChecklist />}
            title="TOTAL TASKS"
            number={dashboardData.totalTasks}
            info={`${dashboardData.completedTasks} done, ${dashboardData.pendingTasks} pending`}
          />
          <DashboardBox
            icon={<FaMoneyBillAlt />}
            title="TOTAL REVENUE"
            number={formatCurrency(dashboardData.totalRevenue)}
            info={`${formatCurrency(dashboardData.pendingPayments)} pending`}
          />
        </div>

        <div className="dashboard-stats">
          <DashboardGraph data={dashboardData} />
          
          <div className="tasks-graph">
            <h4>Task Distribution</h4>
            <div className="circle">
              <div>
                <span>{dashboardData.totalTasks}</span>
                <p>Total Tasks</p>
              </div>
            </div>
            <div className="tasks-distribution">
              <div className="task-data">
                <p>Completed</p>
                <span>{dashboardData.completedTasks}</span>
              </div>
              <div className="task-data">
                <p>Pending</p>
                <span>{dashboardData.pendingTasks}</span>
              </div>
              <div className="task-data">
                <p>Overdue</p>
                <span>{dashboardData.overdueTasks}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;