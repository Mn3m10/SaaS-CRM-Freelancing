/* eslint-disable no-unused-vars */
import React from "react";

export const PersonalDataFrom = ({ personalInfo }) => {
  return (
    <form onSubmit={personalInfo.handleSubmit}>
      <div className="input-group">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          name="name"
          placeholder="Enter your name"
          onChange={personalInfo.handleChange}
          onBlur={personalInfo.handleBlur}
          value={personalInfo.values.name}
          className={
            personalInfo.touched.name && personalInfo.errors.name
              ? "error-input"
              : ""
          }
        />
        {personalInfo.touched.name && personalInfo.errors.name && (
          <span className="error">{personalInfo.errors.name}</span>
        )}
      </div>

      <div className="input-group">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          name="title"
          placeholder="Enter your title"
          onChange={personalInfo.handleChange}
          onBlur={personalInfo.handleBlur}
          value={personalInfo.values.title}
        />
        {personalInfo.touched.title && personalInfo.errors.title && (
          <span className="error">{personalInfo.errors.title}</span>
        )}
      </div>

      <div className="input-group">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="Enter your email"
          onChange={personalInfo.handleChange}
          onBlur={personalInfo.handleBlur}
          value={personalInfo.values.email}
          className={
            personalInfo.touched.email && personalInfo.errors.email
              ? "error-input"
              : ""
          }
        />
        {personalInfo.touched.email && personalInfo.errors.email && (
          <span className="error">{personalInfo.errors.email}</span>
        )}
      </div>

      <div className="input-group">
        <label htmlFor="phone">Phone Number</label>
        <input
          id="phone"
          type="text"
          name="phone"
          placeholder="Enter your phone number"
          onChange={personalInfo.handleChange}
          onBlur={personalInfo.handleBlur}
          value={personalInfo.values.phone}
          className={
            personalInfo.touched.phone && personalInfo.errors.phone
              ? "error-input"
              : ""
          }
        />
        {personalInfo.touched.phone && personalInfo.errors.phone && (
          <span className="error">{personalInfo.errors.phone}</span>
        )}
      </div>
      <button type="submit" className="save-btn">
        Save Changes
      </button>
    </form>
  );
};

export const PasswordForm = ({passwordInfo}) => {
  return (
    <form onSubmit={passwordInfo.handleSubmit}>
      <div className="inputs pass-inputs">
        <div className="input-box full-width">
          <label htmlFor="current-password">Current Password</label>
          <input
            type="password"
            id="current-password"
            placeholder="Enter current password"
            name="currentPassword"
            value={passwordInfo.values.currentPassword}
            onChange={passwordInfo.handleChange}
            onBlur={passwordInfo.handleBlur}
            className={
              passwordInfo.touched.currentPassword &&
              passwordInfo.errors.currentPassword
                ? "error-input"
                : ""
            }
          />
          {passwordInfo.touched.currentPassword &&
            passwordInfo.errors.currentPassword && (
              <span className="error">
                {passwordInfo.errors.currentPassword}
              </span>
            )}
        </div>

        <div className="input-box">
          <label htmlFor="new-password">New Password</label>
          <input
            type="password"
            id="new-password"
            name="newPassword"
            placeholder="Enter new password"
            value={passwordInfo.values.newPassword}
            onChange={passwordInfo.handleChange}
            onBlur={passwordInfo.handleBlur}
            className={
              passwordInfo.touched.newPassword &&
              passwordInfo.errors.newPassword
                ? "error-input"
                : ""
            }
          />
          {passwordInfo.touched.newPassword &&
            passwordInfo.errors.newPassword && (
              <span className="error">{passwordInfo.errors.newPassword}</span>
            )}
        </div>

        <div className="input-box">
          <label htmlFor="confirm-password">Confirm New Password</label>
          <input
            type="password"
            id="confirm-password"
            name="confirmNewPassword"
            placeholder="Confirm new password"
            value={passwordInfo.values.confirmNewPassword}
            onChange={passwordInfo.handleChange}
            onBlur={passwordInfo.handleBlur}
            className={
              passwordInfo.touched.confirmNewPassword &&
              passwordInfo.errors.confirmNewPassword
                ? "error-input"
                : ""
            }
          />
          {passwordInfo.touched.confirmNewPassword &&
            passwordInfo.errors.confirmNewPassword && (
              <span className="error">
                {passwordInfo.errors.confirmNewPassword}
              </span>
            )}
        </div>
        <button type="submit" className="save-btn">
          Save Changes
        </button>
      </div>
    </form>
  );
};
