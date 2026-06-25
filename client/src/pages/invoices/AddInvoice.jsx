import { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { FiChevronRight, FiFileText } from "react-icons/fi";
import "./Invoices.css";
import { success, failed } from "../../assets/utils/Toasts";
import { invoiceValidationSchema } from "../../assets/utils/Validations";
import AddInvoiceForm from "../../components/AddInvoiceForm";

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

const AddInvoice = () => {
  const navigate = useNavigate();

  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isLoadingClients, setIsLoadingClients] = useState(true);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [clientsError, setClientsError] = useState("");
  const [projectsError, setProjectsError] = useState("");

  useEffect(() => {
    const loadClients = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/clients?limit=1000`, {
          headers: getAuthHeaders(),
        });

        const payload = await response.json();

        if (!response.ok) {
          throw new Error(getApiError(payload));
        }

        const clientsData = Array.isArray(payload.data) ? payload.data : [];
        setClients(clientsData);
      } catch (error) {
        console.error("Error loading clients:", error);
        setClientsError(error.message || "Unable to load clients.");
        setClients([]);
      } finally {
        setIsLoadingClients(false);
      }
    };

    const loadProjects = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/projects?limit=1000`, {
          headers: getAuthHeaders(),
        });

        const payload = await response.json();

        if (!response.ok) {
          throw new Error(getApiError(payload));
        }

        const projectsData = Array.isArray(payload.data) ? payload.data : [];
        setProjects(projectsData);
      } catch (error) {
        console.error("Error loading projects:", error);
        setProjectsError(error.message || "Unable to load projects.");
        setProjects([]);
      } finally {
        setIsLoadingProjects(false);
      }
    };

    loadClients();
    loadProjects();
  }, []);

  const formik = useFormik({
    initialValues: {
      invoiceNumber: "",
      clientId: "",
      projectId: "",
      amount: "",
      dueDate: "",
    },

    validationSchema: invoiceValidationSchema,

    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        const userData = JSON.parse(localStorage.getItem("user") || "{}");
        const userId = userData._id || userData.id;

        if (!userId) {
          failed("User ID not found. Please login again.");
          setSubmitting(false);
          return;
        }

        const invoiceData = {
          invoiceNumber: values.invoiceNumber.trim(),
          client: values.clientId,
          project: values.projectId,
          amount: Number(values.amount),
          dueDate: values.dueDate,
          status: "pending",
          user: userId,
        };

        const response = await fetch(`${API_BASE_URL}/invoices`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify(invoiceData),
        });

        const payload = await response.json();

        if (!response.ok) {
          if (response.status === 400) {
            if (payload.message?.includes("invoiceNumber")) {
              setFieldError("invoiceNumber", payload.message);
            } else if (payload.message?.includes("amount")) {
              setFieldError("amount", payload.message);
            } else if (payload.message?.includes("client")) {
              setFieldError("clientId", "Invalid client selected.");
            } else if (payload.message?.includes("project")) {
              setFieldError("projectId", "Invalid project selected.");
            } else if (payload.message?.includes("dueDate")) {
              setFieldError("dueDate", payload.message);
            } else {
              failed(payload.message || "Failed to create invoice.");
            }
          } else {
            failed(
              payload.message || "Failed to create invoice. Please try again.",
            );
          }
          setSubmitting(false);
          return;
        }

        success("Invoice created successfully!");
        setSubmitting(false);

        navigate("/layout/invoices", {
          state: { refresh: true },
          replace: true,
        });
      } catch (error) {
        console.error("Error creating invoice:", error);
        failed("Failed to create invoice. Please try again.");
        setSubmitting(false);
      }
    },
  });

  const availableProjects = projects.filter(
    (project) =>
      project.client === formik.values.clientId ||
      project.client?._id === formik.values.clientId,
  );

  const getFieldError = (fieldName) =>
    formik.touched[fieldName] && formik.errors[fieldName];

  return (
    <section className="add-invoice-page">
      <div className="container">
        <div className="invoice-breadcrumb">
          <button type="button" onClick={() => navigate("/layout/invoices")}>
            Invoices
          </button>

          <FiChevronRight />
          <span>Create Invoice</span>
        </div>

        <div className="add-invoice-page__header">
          <div>
            <p className="invoices-page__eyebrow">Financial Workspace</p>
            <h1>Create New Invoice</h1>
            <p>
              Choose a client and project, then set the amount and payment
              deadline.
            </p>
          </div>

          <div className="add-invoice-page__icon">
            <FiFileText />
          </div>
        </div>

        <AddInvoiceForm
          formik={formik}
          projectsError={projectsError}
          clientsError={clientsError}
          isLoadingProjects={isLoadingProjects}
          isLoadingClients={isLoadingClients}
          clients={clients}
          availableProjects={availableProjects}
          getFieldError={getFieldError}
        />
      </div>
    </section>
  );
};

export default AddInvoice;
