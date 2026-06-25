// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import logo from "../../../public/logo.png";

import "./Signup.css";
import { useFormik } from "formik";

import { TbRosetteDiscountCheckFilled } from "react-icons/tb";


import { success , failed } from "../../assets/utils/Toasts";
import { signupValidationSchema } from "../../assets/utils/Validations";
import SignupForm from "../../components/SignupForm";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();



  
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
          failed(
            result.errors[0].msg ||
              result.message ||
              "Failed to create account",
          );
          return;
        }
        console.log(result);
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.data));
        success(result.message || "Account created successfully");
        loginForm.resetForm();
        navigate("/layout/dashboard");
      } catch (error) {
        console.log(error);
        failed("Server error please try again later");
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
        <SignupForm loginForm={loginForm}/>
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
