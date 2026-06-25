import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FiCalendar, FiChevronRight, FiPlus } from "react-icons/fi";
import "./Tasks.css";
import { success, failed } from "../../assets/utils/Toasts";

const API_BASE_URL = "http://localhost:5000/api/v1";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token") || "";
  const headers = { "Content-Type": "application/json" };

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

const getToday = () => new Date().toISOString().split("T")[0];

const taskValidationSchema = Yup.object({
  title: Yup.string()
    .trim()
    .min(5, "Task title must be at least 5 characters.")
    .max(30, "Task title cannot be longer than 30 characters.")
    .required("Task title is required."),

  description: Yup.string()
    .trim()
    .min(10, "Description must be at least 10 characters.")
    .max(50, "Description cannot be longer than 50 characters.")
    .required("Task description is required."),

  project: Yup.string().required("Please select a related project."),

  deadline: Yup.date()
    .min(getToday(), "Deadline cannot be in the past.")
    .required("Please choose a deadline."),
});

const AddTask = () => {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [projectsError, setProjectsError] = useState("");

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      project: "",
      deadline: "",
    },

    validationSchema: taskValidationSchema,

    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        const userId = userData._id || userData.id;

        if (!userId) {
          failed("User ID not found. Please login again.");
          setSubmitting(false);
          return;
        }

        const taskData = {
          title: values.title.trim(),
          description: values.description.trim(),
          project: values.project,
          deadline: values.deadline,
          status: "pending",
          user: userId,
        };

        const response = await fetch(`${API_BASE_URL}/tasks`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(taskData),
        });

        const payload = await response.json();

        if (!response.ok) {
          if (response.status === 400) {
            if (payload.message?.includes("title")) {
              setFieldError("title", payload.message);
            } else if (payload.message?.includes("description")) {
              setFieldError("description", payload.message);
            } else if (payload.message?.includes("project")) {
              setFieldError("project", "Invalid project selected.");
            } else if (payload.message?.includes("deadline")) {
              setFieldError("deadline", payload.message);
            } else {
              failed(payload.message || "Failed to create task.");
            }
          } else {
            failed(
              payload.message || "Failed to create task. Please try again.",
            );
          }
          setSubmitting(false);
          return;
        }

        success("Task created successfully!");
        setSubmitting(false);

        navigate("/layout/tasks", {
          state: { refresh: true },
          replace: true,
        });
      } catch (error) {
        console.error("Error creating task:", error);
        failed("Failed to create task. Please try again.");
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/projects?limit=1000`, {
          headers: getAuthHeaders(),
        });

        const payload = await response.json();

        if (!response.ok) {
          throw new Error(getApiError(payload));
        }

        const projectsData = Array.isArray(payload.data)
          ? payload.data
          : Array.isArray(payload)
            ? payload
            : [];

        setProjects(projectsData);
      } catch (error) {
        console.error("Error loading projects:", error);
        setProjectsError(error.message || "Unable to load projects.");
        setProjects([]);
      } finally {
        setIsLoadingProjects(false);
      }
    };

    loadProjects();
  }, []);

  const getFieldError = (fieldName) =>
    formik.touched[fieldName] && formik.errors[fieldName];

  return (
    <section className="add-task-page">
      <div className="container">
        <div className="task-breadcrumb">
          <button type="button" onClick={() => navigate("/layout/tasks")}>
            Tasks
          </button>

          <FiChevronRight />
          <span>New Task</span>
        </div>

        <div className="add-task-page__heading">
          <div>
            <h1>Create New Task</h1>
            <p>
              Define your next milestone and assign it to a project workflow.
            </p>
          </div>
        </div>

        <form
          className="task-form-card"
          onSubmit={formik.handleSubmit}
          noValidate
        >
          <div className="task-form-group">
            <label htmlFor="title">Task Title</label>

            <input
              id="title"
              name="title"
              type="text"
              placeholder="e.g. Prepare the website content"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={getFieldError("title") ? "has-error" : ""}
              aria-invalid={Boolean(getFieldError("title"))}
            />

            {getFieldError("title") && (
              <small className="task-form-error">{formik.errors.title}</small>
            )}
          </div>

          <div className="task-form-group">
            <div className="task-form-group__label-row">
              <label htmlFor="description">Description</label>
              <span>{formik.values.description.length}/50</span>
            </div>

            <textarea
              id="description"
              name="description"
              placeholder="Briefly describe what needs to be done..."
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={getFieldError("description") ? "has-error" : ""}
              aria-invalid={Boolean(getFieldError("description"))}
            />

            {getFieldError("description") && (
              <small className="task-form-error">
                {formik.errors.description}
              </small>
            )}
          </div>

          <div className="task-form-row">
            <div className="task-form-group">
              <label htmlFor="project">Related Project</label>

              <select
                id="project"
                name="project"
                value={formik.values.project}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={isLoadingProjects}
                className={getFieldError("project") ? "has-error" : ""}
                aria-invalid={Boolean(getFieldError("project"))}
              >
                <option value="">
                  {isLoadingProjects
                    ? "Loading projects..."
                    : "Select a project"}
                </option>

                {projects.map((project) => (
                  <option
                    key={project._id || project.id}
                    value={project._id || project.id}
                  >
                    {project.title || project.name || "Untitled project"}
                  </option>
                ))}
              </select>

              {getFieldError("project") && (
                <small className="task-form-error">
                  {formik.errors.project}
                </small>
              )}

              {projectsError && (
                <small className="task-form-error">{projectsError}</small>
              )}
            </div>

            <div className="task-form-group">
              <label htmlFor="deadline">Deadline</label>

              <div className="task-date-input">
                <input
                  id="deadline"
                  name="deadline"
                  type="date"
                  min={getToday()}
                  value={formik.values.deadline}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={getFieldError("deadline") ? "has-error" : ""}
                  aria-invalid={Boolean(getFieldError("deadline"))}
                />

                <FiCalendar />
              </div>

              {getFieldError("deadline") && (
                <small className="task-form-error">
                  {formik.errors.deadline}
                </small>
              )}
            </div>
          </div>

          <div className="task-form-card__actions">
            <button
              type="button"
              className="task-button task-button--secondary"
              onClick={() => navigate("/layout/tasks")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="task-button task-button--primary"
              disabled={formik.isSubmitting || isLoadingProjects}
            >
              <FiPlus />
              {formik.isSubmitting ? "Creating..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AddTask;
