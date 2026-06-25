// eslint-disable-next-line no-unused-vars
import React from "react";

const DashboardBox = ({ icon, title, number, info }) => {
  return (
    <div className="dash-box">
      <div className="icons">{icon}</div>
      <h2 className="title">{title}</h2>
      <div className="number">{number}</div>
      <p className="info">{info}</p>
    </div>
  );
};

export default DashboardBox;
