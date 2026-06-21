// eslint-disable-next-line no-unused-vars
import React from "react";
import login_image from "../../assets/images/login-image.png";
import logo from "../../../public/logo.png";
import { MdArrowRightAlt } from "react-icons/md";
import "./Login.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { MdEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa6";

const Login = () => {
  const navigate = useNavigate();

  const successLogin = (message) => {
    toast.success(message, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
      transition: Bounce,
    });
  };

  const failedLogin = (message) => {
    toast.error(message, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
      transition: Bounce,
    });
  };

  const loginValidationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email formate")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "At least 8 characters")
      .required("Password is required"),
  });

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
          failedLogin(result.message || "Login failed");
          return;
        }
        localStorage.setItem("token", result.token);
        successLogin(result.message || "Logged in successfully");
        loginForm.resetForm();
        navigate("/layout");
      } catch (error) {
        console.log(error);
        failedLogin("Server error, please try again later");
      }
    },
  });

  return (
    <section className="login-section">
      <div className="form">
        <div className="form-content">
          <div className="logo">
            <img src={logo} alt="logo" />
          </div>
          <h1>Welcome Back</h1>
          <p>
            Access your dashboard and manage your client relations with
            precision.
          </p>
        </div>
        <form onSubmit={loginForm.handleSubmit}>
          <div className="input-box">
            <label htmlFor="email">Email Address</label>
            <div className="input">
              <MdEmail />
              <input
                type="email"
                name="email"
                id="email"
                placeholder="exameple@gmail.com"
                value={loginForm.values.email}
                onChange={loginForm.handleChange}
                onBlur={loginForm.handleBlur}
              />
            </div>
            {loginForm.touched.email && loginForm.errors.email && (
              <span className="error">{loginForm.errors.email}</span>
            )}
          </div>
          <div className="input-box">
            <label htmlFor="password">Password</label>
            <div className="input">
              <FaLock />
              <input
                type="password"
                name="password"
                id="password"
                placeholder="*********"
                value={loginForm.values.password}
                onChange={loginForm.handleChange}
                onBlur={loginForm.handleBlur}
              />
            </div>
            {loginForm.touched.password && loginForm.errors.password && (
              <span className="error">{loginForm.errors.password}</span>
            )}
          </div>
          <button type="submit">
            Login <MdArrowRightAlt />
          </button>
          <hr />
          <p className="account">
            Don't have an account ? <Link to="/singup">Create new account</Link>
          </p>
        </form>
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
