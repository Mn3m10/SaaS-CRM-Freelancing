import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { FiCalendar, FiChevronRight, FiPlus } from "react-icons/fi";
import "./Tasks.css";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1"
).replace(/\/$/, "");

const getAuthHeaders = (withJson = false) => {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("authToken") ||
    sessionStorage.getItem("token") ||
    "";

  const headers = withJson ? { "Content-Type": "application/json" } : {};

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
    .max(15, "Task title cannot be longer than 15 characters.")
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

  priority: Yup.string().oneOf(["medium", "high"]).required(),
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
      priority: "medium",
    },

    validationSchema: taskValidationSchema,

    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await fetch(`${API_BASE_URL}/tasks`, {
          method: "POST",
          headers: getAuthHeaders(true),
          body: JSON.stringify({
            title: values.title.trim(),
            description: values.description.trim(),
            project: values.project,
            deadline: values.deadline,
            status: "pending",
            priority: values.priority,
          }),
        });

        const payload = await response.json();

        if (!response.ok) {
          throw new Error(getApiError(payload));
        }

        toast.success("Task created successfully.");
        navigate("/layout/tasks");
      } catch (error) {
        toast.error(error.message || "Unable to create the task.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/projects?limit=100`, {
          headers: getAuthHeaders(),
        });

        const payload = await response.json();

        if (!response.ok) {
          throw new Error(getApiError(payload));
        }

        setProjects(Array.isArray(payload.data) ? payload.data : []);
      } catch (error) {
        setProjectsError(error.message || "Unable to load projects.");
      } finally {
        setIsLoadingProjects(false);
      }
    };

    loadProjects();
  }, []);

  const getFieldError = (fieldName) =>
    formik.touched[fieldName] && formik.errors[fieldName];

  const isHighPriority = formik.values.priority === "high";

  return (
    <section className="add-task-page">
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
          <p>Define your next milestone and assign it to a project workflow.</p>
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
                {isLoadingProjects ? "Loading projects..." : "Select a project"}
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

        <label className="high-priority-control">
          <input
            type="checkbox"
            checked={isHighPriority}
            onChange={(event) =>
              formik.setFieldValue(
                "priority",
                event.target.checked ? "high" : "medium"
              )
            }
          />

          <span className="high-priority-control__box" />

          <span>
            <strong>High Priority</strong>
            <small>Mark this task as urgent in the task list.</small>
          </span>
        </label>

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
    </section>
  );
};

export default AddTask;
