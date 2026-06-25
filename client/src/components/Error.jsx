// eslint-disable-next-line no-unused-vars
import React from "react";
import { useNavigate } from "react-router-dom";

const Error = () => {
  const navigate = useNavigate();
  return (
    <div className="container">
      <h1
        style={{
          color: "red",
          textAlign: "center",
        }}
      >
        Error, Please login first
      </h1>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "50px",
          gap: "20px",
        }}
      >
        <button
        onClick={() => navigate("/")}
          style={{
            padding: "15px 20px",
            fontSize: "18px",
            borderRadius: "15px",
            color: "white",
            background: "var(--link)",
          }}
        >
          Login
        </button>
        <button
        onClick={() => navigate("/signup")}
          style={{
            padding: "15px 20px",
            fontSize: "18px",
            borderRadius: "15px",
            color: "white",
            background: "var(--link)",
          }}
        >
          Create New Account
        </button>
      </div>
    </div>
  );
};

export default Error;
