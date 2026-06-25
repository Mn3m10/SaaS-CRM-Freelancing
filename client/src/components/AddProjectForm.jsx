/* eslint-disable no-unused-vars */
import React from "react";
import {
  FiChevronRight,
  FiCalendar,
  FiUser,
  FiBriefcase,
  FiPlus,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const AddProjectForm = ({
  formik,
  getFieldError,
  isLoadingClients,
  clients,
}) => {
  const navigate = useNavigate();
  return (
    <form
      className="project-form-card"
      onSubmit={formik.handleSubmit}
      noValidate
    >
      <div className="project-form-section">
        <div className="project-form-section__title">
          <h2>Project Information</h2>
          <p>Basic details about the project.</p>
        </div>

        <div className="project-form-grid">
          <div className="project-form-group project-form-group--full">
            <label htmlFor="title">Project Title</label>

            <input
              id="title"
              name="title"
              type="text"
              placeholder="e.g. Website Redesign"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={getFieldError("title") ? "has-error" : ""}
            />

            {getFieldError("title") && (
              <small className="project-form-error">
                {formik.errors.title}
              </small>
            )}
          </div>

          <div className="project-form-group project-form-group--full">
            <label htmlFor="description">Description</label>

            <textarea
              id="description"
              name="description"
              placeholder="Describe the project scope and objectives..."
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={getFieldError("description") ? "has-error" : ""}
              rows="4"
            />

            <div className="project-form-char-count">
              <span>{formik.values.description.length}/100</span>
            </div>

            {getFieldError("description") && (
              <small className="project-form-error">
                {formik.errors.description}
              </small>
            )}
          </div>
        </div>
      </div>

      <div className="project-form-section">
        <div className="project-form-section__title">
          <h2>Assignment & Timeline</h2>
          <p>Assign the project to a client and set the deadline.</p>
        </div>

        <div className="project-form-grid">
          <div className="project-form-group">
            <label htmlFor="client">Client</label>

            <div className="project-form-input-icon">
              <FiUser />

              <select
                id="client"
                name="client"
                value={formik.values.client}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={getFieldError("client") ? "has-error" : ""}
                disabled={isLoadingClients}
              >
                <option value="">
                  {isLoadingClients ? "Loading clients..." : "Select a client"}
                </option>
                {clients.map((client) => (
                  <option
                    key={client._id || client.id}
                    value={client._id || client.id}
                  >
                    {client.name}
                  </option>
                ))}
              </select>
            </div>

            {getFieldError("client") && (
              <small className="project-form-error">
                {formik.errors.client}
              </small>
            )}
          </div>

          <div className="project-form-group">
            <label htmlFor="deadline">Deadline</label>

            <div className="project-form-input-icon">
              <FiCalendar />

              <input
                id="deadline"
                name="deadline"
                type="date"
                value={formik.values.deadline}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={getFieldError("deadline") ? "has-error" : ""}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>

            {getFieldError("deadline") && (
              <small className="project-form-error">
                {formik.errors.deadline}
              </small>
            )}
          </div>
        </div>
      </div>

      <div className="project-form-actions">
        <button
          type="button"
          className="project-button project-button--secondary"
          onClick={() => navigate("/layout/projects")}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="project-button project-button--primary"
          disabled={formik.isSubmitting}
        >
          <FiPlus />
          {formik.isSubmitting ? "Creating..." : "Create Project"}
        </button>
      </div>
    </form>
  );
};

export default AddProjectForm;
