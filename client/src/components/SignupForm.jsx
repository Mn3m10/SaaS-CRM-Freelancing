/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { FaUserLarge } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa6";
import { FaRegEye } from "react-icons/fa6";
import { FaRegEyeSlash } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { MdArrowRightAlt } from "react-icons/md";

const SignupForm = ({ loginForm }) => {
  const [showPass, setShowPass] = useState(false);

  return (
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
            <FaRegEye onClick={() => setShowPass(!showPass)} className="eye" />
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
  );
};

export default SignupForm;
