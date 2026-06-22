// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import logo from "../../../public/logo.png";
import { MdArrowRightAlt } from "react-icons/md";
import "./Signup.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { TbRosetteDiscountCheckFilled } from "react-icons/tb";
import { FaUserLarge } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa6";

const Signup = () => {
  const navigate = useNavigate();

  const [showPass, setShowPass] = useState(false);

  const successSignup = (message) => {
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

  const failedSignup = (message) => {
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

  const signupValidationSchema = Yup.object({
    name: Yup.string()
      .min(3, "At least 3 characters")
      .max(20, "At most 20 chatacters")
      .required("Name is required"),
    email: Yup.string()
      .email("Invalid email formate")
      .required("Email is required"),
    password: Yup.string()
      .min(8, "At least 8 characters")
      .required("Password is required"),
    terms: Yup.boolean().oneOf(
      [true],
      "You must agree to the Terms of Service and Privacy Policy",
    ),
  });

  const loginForm = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      terms: false,
    },

    validationSchema: signupValidationSchema,

    onSubmit: async (values) => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/v1/auth/signup/",
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
          failedSignup(
            result.errors[0].msg ||
              result.message ||
              "Failed to create account",
          );
          return;
        }
        console.log(result);
        localStorage.setItem("token", result.token);
        successSignup(result.message || "Account created successfully");
        loginForm.resetForm();
        navigate("/layout");
      } catch (error) {
        console.log(error);
        failedSignup("Server error please try again later");
      }
    },
  });

  return (
    <section className="signup-section">
      <div className="form">
        <div className="form-content">
          <div className="logo">
            <img src={logo} alt="logo" /> 
            <h3>Freelix</h3>
          </div>
          <h1>Create Your Account</h1>
          <p>Precision tracking for modern enterprises.</p>
        </div>
        <form onSubmit={loginForm.handleSubmit}>
          <div className="input-box">
            <label htmlFor="name">Name</label>
            <div className="input">
              <FaUserLarge className="icon" />
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Enter your name."
                value={loginForm.values.name}
                onChange={loginForm.handleChange}
                onBlur={loginForm.handleBlur}
              />
            </div>
            {loginForm.touched.name && loginForm.errors.name && (
              <span className="error">{loginForm.errors.name}</span>
            )}
          </div>
          <div className="input-box">
            <label htmlFor="email">Email Address</label>
            <div className="input">
              <MdEmail className="icon" />
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
              <FaLock className="icon" />
              <input
                type={showPass ? "text" : "password"}
                name="password"
                id="password"
                placeholder="*********"
                value={loginForm.values.password}
                onChange={loginForm.handleChange}
                onBlur={loginForm.handleBlur}
              />
              {showPass ? (
                <FaRegEye
                  onClick={() => setShowPass(!showPass)}
                  className="eye"
                />
              ) : (
                <FaRegEyeSlash
                  onClick={() => setShowPass(!showPass)}
                  className="eye"
                />
              )}
            </div>
            {loginForm.touched.password && loginForm.errors.password && (
              <span className="error">{loginForm.errors.password}</span>
            )}
          </div>
          <div className="input-box">
            <input
              type="checkbox"
              name="terms"
              id="terms"
              value={loginForm.values.terms}
              onChange={loginForm.handleChange}
              onBlur={loginForm.handleBlur}
            />
            <p>I agree to the Terms of Service and Privacy Policy.</p>
            {loginForm.touched.password && loginForm.errors.password && (
              <span className="error">{loginForm.errors.terms}</span>
            )}
          </div>
          <button type="submit">
            Create Account <MdArrowRightAlt />
          </button>
          <hr />
          <p className="account">
            Alreay have an account ? <Link to="/">Login</Link>
          </p>
        </form>
      </div>
      <div className="signup-content">
        <div className="trust">
          <TbRosetteDiscountCheckFilled /> Trusted by 10k+ businesses
        </div>
        <h2>The speed of light, applied to your ledger.</h2>
        <p>
          Join the next generation of financial management. Experience real-time
          data integrity and seamless multi-channel integration.
        </p>
        <div className="stats">
          <div className="box">
            <h4>99.9%</h4>
            <p>Uptime SLA</p>
          </div>
          <div className="box">
            <h4>256-bit</h4>
            <p>Encryption</p>
          </div>
          <div className="box">
            <h4>&lt; 2ms</h4>
            <p>Latency</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup;
