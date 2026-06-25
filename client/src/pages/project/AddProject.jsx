import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import {
  FiChevronRight,
  FiCalendar,
  FiUser,
  FiBriefcase,
  FiPlus,
} from "react-icons/fi";
import { useEffect, useState } from "react";
import "./Projects.css";
import { success, failed } from "../../assets/utils/Toasts";

const API_BASE_URL = "http://localhost:5000/api/v1";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token") || "";
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers.Authorization = token.startsWith("Bearer ")
      ? token
      : `Bearer ${token}`;
  }
  return headers;
};

const getApiError = (payload) =>
  payload?.errors?.[0]?.msg ||
  payload?.message ||
  "Something went wrong. Please try again.";

const projectValidationSchema = Yup.object({
  title: Yup.string()
    .trim()
    .min(5, "Project title must be at least 5 characters.")
    .max(50, "Project title cannot be longer than 50 characters.")
    .required("Project title is required."),

  description: Yup.string()
    .trim()
    .min(10, "Description must be at least 10 characters.")
    .max(100, "Description cannot be longer than 100 characters.")
    .required("Description is required."),

  deadline: Yup.date()
    .nullable()
    .test("is-future", "Deadline must be a future date", function (value) {
      if (!value) return true;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return new Date(value) >= today;
    }),

  client: Yup.string().required("Please select a client."),
});

const AddProject = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [isLoadingClients, setIsLoadingClients] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/clients`, {
          headers: getAuthHeaders(),
        });

        const payload = await response.json();

        if (!response.ok) {
          throw new Error(getApiError(payload));
        }

        setClients(Array.isArray(payload.data) ? payload.data : []);
      } catch (error) {
        console.error("Error fetching clients:", error);
        failed("Failed to load clients. Please refresh and try again.");
        setClients([]);
      } finally {
        setIsLoadingClients(false);
      }
    };

    fetchClients();
  }, []);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      deadline: "",
      client: "",
    },

    validationSchema: projectValidationSchema,

    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        const userId = userData._id || userData.id;

        if (!userId) {
          failed("User ID not found. Please login again.");
          setSubmitting(false);
          return;
        }

        if (!values.client) {
          setFieldError("client", "Please select a client.");
          setSubmitting(false);
          return;
        }

        const response = await fetch(`${API_BASE_URL}/projects`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({
            title: values.title.trim(),
            description: values.description.trim(),
            deadline: values.deadline || undefined,
            client: values.client,
            status: "pending",
            user: userId,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          if (response.status === 400) {
            if (data.message?.includes("client")) {
              setFieldError("client", "Invalid client selected.");
            } else if (data.message?.includes("title")) {
              setFieldError("title", data.message);
            } else if (data.message?.includes("description")) {
              setFieldError("description", data.message);
            } else {
              failed(data.message || "Failed to create project.");
            }
          } else {
            failed(
              data.message || "Failed to create project. Please try again.",
            );
          }
          setSubmitting(false);
          return;
        }

        success("Project created successfully!");
        setSubmitting(false);

        navigate("/layout/projects", {
          state: { refresh: true },
          replace: true,
        });
      } catch (error) {
        console.error("Error creating project:", error);
        failed("Failed to create project. Please try again.");
        setSubmitting(false);
      }
    },
  });

  const getFieldError = (fieldName) =>
    formik.touched[fieldName] && formik.errors[fieldName];

  return (
    <section className="add-project-page">
      <div className="container">
        <div className="project-breadcrumb">
          <button type="button" onClick={() => navigate("/layout/projects")}>
            Projects
          </button>

          <FiChevronRight />
          <span>Add Project</span>
        </div>

        <div className="add-project-page__header">
          <div>
            <p className="projects-page__eyebrow">Workspace</p>
            <h1>Add New Project</h1>
            <p>Create a new project and assign it to a client.</p>
          </div>

          <div className="add-project-page__icon">
            <FiBriefcase />
          </div>
        </div>

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
                      {isLoadingClients
                        ? "Loading clients..."
                        : "Select a client"}
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
      </div>
    </section>
  );
};

export default AddProject;
