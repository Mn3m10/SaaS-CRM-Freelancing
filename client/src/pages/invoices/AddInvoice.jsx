import { useMemo } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FiCalendar,
  FiChevronRight,
  FiDollarSign,
  FiFileText,
  FiPlus,
} from "react-icons/fi";
import "./Invoices.css";

const CLIENTS_STORAGE_KEY = "saas_crm_demo_clients";
const INVOICES_STORAGE_KEY = "saas_crm_demo_invoices";

const DEMO_CLIENTS = [
  { id: "client-1", name: "Olivia Rhye", company: "Layers Inc." },
  { id: "client-2", name: "Phoenix Baker", company: "Quotient" },
  { id: "client-3", name: "Lana Steiner", company: "Catalog" },
  { id: "client-4", name: "Demi Wilkinson", company: "Openbox Studio" },
  { id: "client-5", name: "Candice Wu", company: "Sisyphus" },
  { id: "client-7", name: "Drew Cano", company: "Wildcard" },
];

const DEMO_PROJECTS = [
  { id: "project-1", name: "Website Redesign", clientId: "client-1" },
  { id: "project-2", name: "Content Strategy", clientId: "client-2" },
  { id: "project-3", name: "Brand Identity", clientId: "client-3" },
  { id: "project-4", name: "Mobile App Design", clientId: "client-4" },
  { id: "project-5", name: "Product Launch", clientId: "client-5" },
  { id: "project-6", name: "Landing Page", clientId: "client-7" },
];

const getToday = () => new Date().toISOString().split("T")[0];

const getClientsFromStorage = () => {
  try {
    const savedClients = JSON.parse(
      localStorage.getItem(CLIENTS_STORAGE_KEY) || "[]"
    );

    if (Array.isArray(savedClients) && savedClients.length > 0) {
      return savedClients;
    }
  } catch (error) {
    console.error("Could not load clients.", error);
  }

  localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(DEMO_CLIENTS));
  return DEMO_CLIENTS;
};

const getInvoicesFromStorage = () => {
  try {
    const savedInvoices = JSON.parse(
      localStorage.getItem(INVOICES_STORAGE_KEY) || "[]"
    );

    return Array.isArray(savedInvoices) ? savedInvoices : [];
  } catch (error) {
    console.error("Could not load invoices.", error);
    return [];
  }
};

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

  status: Yup.string()
    .oneOf(["pending", "paid", "overdue", "cancelled"])
    .required("Invoice status is required."),
});

const AddInvoice = () => {
  const navigate = useNavigate();

  const clients = useMemo(() => getClientsFromStorage(), []);
  const savedInvoices = useMemo(() => getInvoicesFromStorage(), []);

  const defaultInvoiceNumber = `INV-${String(
    1001 + savedInvoices.length
  ).padStart(4, "0")}`;

  const formik = useFormik({
    initialValues: {
      invoiceNumber: defaultInvoiceNumber,
      clientId: "",
      projectId: "",
      amount: "",
      dueDate: "",
      status: "pending",
    },

    validationSchema: invoiceValidationSchema,

    onSubmit: (values, { setSubmitting, setFieldError }) => {
      const allInvoices = getInvoicesFromStorage();

      const invoiceNumberExists = allInvoices.some(
        (invoice) =>
          String(invoice.invoiceNumber).toLowerCase() ===
          values.invoiceNumber.trim().toLowerCase()
      );

      if (invoiceNumberExists) {
        setFieldError(
          "invoiceNumber",
          "This invoice number is already in use."
        );
        setSubmitting(false);
        return;
      }

      const selectedClient = clients.find(
        (client) => client.id === values.clientId
      );

      const selectedProject = DEMO_PROJECTS.find(
        (project) => project.id === values.projectId
      );

      const newInvoice = {
        id: `invoice-${Date.now()}`,
        invoiceNumber: values.invoiceNumber.trim(),
        clientId: values.clientId,
        clientName: selectedClient?.name || "Unknown Client",
        projectId: values.projectId,
        projectName: selectedProject?.name || "Untitled Project",
        amount: Number(values.amount),
        dueDate: values.dueDate,
        status: values.status,
        issuedAt: new Date().toISOString(),
      };

      localStorage.setItem(
        INVOICES_STORAGE_KEY,
        JSON.stringify([...allInvoices, newInvoice])
      );

      toast.success("Invoice created successfully.");
      setSubmitting(false);
      navigate("/layout/invoices");
    },
  });

  const availableProjects = DEMO_PROJECTS.filter(
    (project) => project.clientId === formik.values.clientId
  );

  const getFieldError = (fieldName) =>
    formik.touched[fieldName] && formik.errors[fieldName];

  return (
    <section className="add-invoice-page">
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
          <p>Choose a client and project, then set the amount and payment deadline.</p>
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
            <p>Set the number, client, and related project for this invoice.</p>
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
                  className={getFieldError("invoiceNumber") ? "has-error" : ""}
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
                className={getFieldError("clientId") ? "has-error" : ""}
              >
                <option value="">Select a client</option>

                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                    {client.company ? ` — ${client.company}` : ""}
                  </option>
                ))}
              </select>

              {getFieldError("clientId") && (
                <small className="invoice-form-error">
                  {formik.errors.clientId}
                </small>
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
                disabled={!formik.values.clientId}
                className={getFieldError("projectId") ? "has-error" : ""}
              >
                <option value="">
                  {formik.values.clientId
                    ? "Select a project"
                    : "Choose a client first"}
                </option>

                {availableProjects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>

              {getFieldError("projectId") && (
                <small className="invoice-form-error">
                  {formik.errors.projectId}
                </small>
              )}
            </div>

            <div className="invoice-form-group">
              <label htmlFor="status">Invoice Status</label>

              <select
                id="status"
                name="status"
                value={formik.values.status}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={getFieldError("status") ? "has-error" : ""}
              >
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
                <option value="cancelled">Cancelled</option>
              </select>

              {getFieldError("status") && (
                <small className="invoice-form-error">
                  {formik.errors.status}
                </small>
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
            disabled={formik.isSubmitting}
          >
            <FiPlus />
            {formik.isSubmitting ? "Creating..." : "Create Invoice"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AddInvoice;
