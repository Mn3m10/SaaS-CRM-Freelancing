// eslint-disable-next-line no-unused-vars
import React from "react";
import login_image from "../../assets/images/login-image.png";
import logo from "../../../public/logo.png";
import "./Login.css";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { success, failed } from "../../assets/utils/Toasts";
import { loginValidationSchema } from "../../assets/utils/Validations";
import LoginForm from "../../components/LoginForm";

const Login = () => {
  const navigate = useNavigate();

  const loginForm = useFormik({
    initialValues: {
      email: "",
      password: "",
    },

    validationSchema: loginValidationSchema,

    onSubmit: async (values) => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/v1/auth/login/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(values),
          },
        );
        const result = await response.json();
        if (!response.ok) {
          failed(result.message || "Login failed");
          return;
        }
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.data));
        success(result.message || "Logged in successfully");
        loginForm.resetForm();
        navigate("/layout/dashboard");
      } catch (error) {
        console.log(error);
        failed("Server error, please try again later");
      }
    },
  });

  return (
    <section className="login-section">
      <div className="form">
        <div className="form-content">
          <div className="logo">
            <img src={logo} alt="logo" /> <h3>Freelix</h3>
          </div>
          <h1>Welcome Back</h1>
          <p>
            Access your dashboard and manage your client relations with
            precision.
          </p>
        </div>
        <LoginForm loginForm={loginForm}/>
      </div>
      <div className="login-content">
        <div className="img">
          <img src={login_image} alt="login-image" />
        </div>
        <h2>Elevate your financial precision.</h2>
        <p>
          Join 2,000+ modern professionals using Kinetic Ledger to automate
          their CRM workflows and scale their freelance operations.
        </p>
      </div>
    </section>
  );
};

export default Login;
