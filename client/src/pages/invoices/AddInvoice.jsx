import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import {
  FiCalendar,
  FiChevronRight,
  FiDollarSign,
  FiFileText,
  FiPlus,
} from "react-icons/fi";
import "./Invoices.css";
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

const invoiceValidationSchema = Yup.object({
  invoiceNumber: Yup.string()
    .trim()
    .min(3, "Invoice number must be at least 3 characters.")
    .max(30, "Invoice number cannot be longer than 30 characters.")
    .required("Invoice number is required."),

  clientId: Yup.string().required("Please select a client."),

  projectId: Yup.string().required("Please select a project."),

  amount: Yup.number()
    .typeError("Amount must be a number.")
    .positive("Amount must be greater than zero.")
    .required("Invoice amount is required."),

  dueDate: Yup.date()
    .min(getToday(), "Due date cannot be in the past.")
    .required("Please select a due date."),
});

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

        <form
          className="invoice-form-card"
          onSubmit={formik.handleSubmit}
          noValidate
        >
          <div className="invoice-form-section">
            <div className="invoice-form-section__title">
              <h2>Invoice Details</h2>
              <p>
                Set the number, client, and related project for this invoice.
              </p>
            </div>

            <div className="invoice-form-grid">
              <div className="invoice-form-group">
                <label htmlFor="invoiceNumber">Invoice Number</label>

                <div className="invoice-form-input-icon">
                  <FiFileText />

                  <input
                    id="invoiceNumber"
                    name="invoiceNumber"
                    type="text"
                    placeholder="e.g. INV-1007"
                    value={formik.values.invoiceNumber}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={
                      getFieldError("invoiceNumber") ? "has-error" : ""
                    }
                  />
                </div>

                {getFieldError("invoiceNumber") && (
                  <small className="invoice-form-error">
                    {formik.errors.invoiceNumber}
                  </small>
                )}
              </div>

              <div className="invoice-form-group">
                <label htmlFor="clientId">Client</label>

                <select
                  id="clientId"
                  name="clientId"
                  value={formik.values.clientId}
                  onChange={(event) => {
                    formik.handleChange(event);
                    formik.setFieldValue("projectId", "");
                  }}
                  onBlur={formik.handleBlur}
                  disabled={isLoadingClients}
                  className={getFieldError("clientId") ? "has-error" : ""}
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

                {getFieldError("clientId") && (
                  <small className="invoice-form-error">
                    {formik.errors.clientId}
                  </small>
                )}

                {clientsError && (
                  <small className="invoice-form-error">{clientsError}</small>
                )}
              </div>

              <div className="invoice-form-group">
                <label htmlFor="projectId">Related Project</label>

                <select
                  id="projectId"
                  name="projectId"
                  value={formik.values.projectId}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  disabled={!formik.values.clientId || isLoadingProjects}
                  className={getFieldError("projectId") ? "has-error" : ""}
                >
                  <option value="">
                    {!formik.values.clientId
                      ? "Choose a client first"
                      : isLoadingProjects
                        ? "Loading projects..."
                        : "Select a project"}
                  </option>

                  {availableProjects.map((project) => (
                    <option
                      key={project._id || project.id}
                      value={project._id || project.id}
                    >
                      {project.title}
                    </option>
                  ))}
                </select>

                {getFieldError("projectId") && (
                  <small className="invoice-form-error">
                    {formik.errors.projectId}
                  </small>
                )}

                {projectsError && (
                  <small className="invoice-form-error">{projectsError}</small>
                )}
              </div>
            </div>
          </div>

          <div className="invoice-form-section invoice-form-section--last">
            <div className="invoice-form-section__title">
              <h2>Payment Information</h2>
              <p>Add the invoice amount and the payment due date.</p>
            </div>

            <div className="invoice-form-grid">
              <div className="invoice-form-group">
                <label htmlFor="amount">Invoice Amount</label>

                <div className="invoice-form-input-icon">
                  <FiDollarSign />

                  <input
                    id="amount"
                    name="amount"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={formik.values.amount}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={getFieldError("amount") ? "has-error" : ""}
                  />
                </div>

                {getFieldError("amount") && (
                  <small className="invoice-form-error">
                    {formik.errors.amount}
                  </small>
                )}
              </div>

              <div className="invoice-form-group">
                <label htmlFor="dueDate">Due Date</label>

                <div className="invoice-form-input-icon">
                  <FiCalendar />

                  <input
                    id="dueDate"
                    name="dueDate"
                    type="date"
                    min={getToday()}
                    value={formik.values.dueDate}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={getFieldError("dueDate") ? "has-error" : ""}
                  />
                </div>

                {getFieldError("dueDate") && (
                  <small className="invoice-form-error">
                    {formik.errors.dueDate}
                  </small>
                )}
              </div>
            </div>
          </div>

          <div className="invoice-form-actions">
            <button
              type="button"
              className="invoices-button invoices-button--secondary"
              onClick={() => navigate("/layout/invoices")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="invoices-button invoices-button--primary"
              disabled={
                formik.isSubmitting || isLoadingClients || isLoadingProjects
              }
            >
              <FiPlus />
              {formik.isSubmitting ? "Creating..." : "Create Invoice"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default AddInvoice;
