// eslint-disable-next-line no-unused-vars
import React from "react";

const DashboardTasks = ({ data }) => {
  return (
    <div className="tasks-graph">
      <h4>Task Distribution</h4>
      <div className="circle">{data?.totalTasks}</div>
      <div className="tasks-distribution">
        <div className="task-data">
          <p>Completed</p>
          <span>{data?.completedTasks}</span>
        </div>
        <div className="task-data">
          <p>In progress</p>
          <span>{data?.overdueTasks}</span>
        </div>
        <div className="task-data">
          <p>Pending Review</p>
          <span>{data?.pendingTasks}</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardTasks;
