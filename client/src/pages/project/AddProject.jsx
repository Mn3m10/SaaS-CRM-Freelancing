import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { FiChevronRight, FiBriefcase } from "react-icons/fi";
import { useEffect, useState } from "react";
import "./Projects.css";
import { success, failed } from "../../assets/utils/Toasts";
import { projectValidationSchema } from "../../assets/utils/Validations";
import AddProjectForm from "../../components/AddProjectForm";

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

        <AddProjectForm
          formik={formik}
          getFieldError={getFieldError}
          isLoadingClients={isLoadingClients}
          clients={clients}
        />
      </div>
    </section>
  );
};

export default AddProject;
