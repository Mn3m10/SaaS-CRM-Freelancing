// eslint-disable-next-line no-unused-vars
import React from "react";
import { MdEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { MdArrowRightAlt } from "react-icons/md";

const LoginForm = ({loginForm}) => {
  return (
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
        Don't have an account ? <Link to="/signup">Create new account</Link>
      </p>
    </form>
  );
};

export default LoginForm;
