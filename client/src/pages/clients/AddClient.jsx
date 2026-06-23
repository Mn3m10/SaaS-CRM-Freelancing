import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  FiChevronRight,
  FiMail,
  FiPhone,
  FiPlus,
  FiUserPlus,
} from "react-icons/fi";
import "./Clients.css";

const CLIENTS_STORAGE_KEY = "saas_crm_demo_clients";

const getSavedClients = () => {
  try {
    const savedClients = JSON.parse(
      localStorage.getItem(CLIENTS_STORAGE_KEY) || "[]"
    );

    return Array.isArray(savedClients) ? savedClients : [];
  } catch (error) {
    console.error("Could not load saved clients.", error);
    return [];
  }
};

const clientValidationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(3, "Client name must be at least 3 characters.")
    .max(15, "Client name cannot be longer than 15 characters.")
    .required("Client name is required."),

  email: Yup.string()
    .trim()
    .email("Please enter a valid email address.")
    .max(30, "Email cannot be longer than 30 characters.")
    .required("Email address is required."),

  phone: Yup.string()
    .trim()
    .matches(
      /^[0-9+\-() ]*$/,
      "Please enter a valid phone number."
    )
    .max(25, "Phone number cannot be longer than 25 characters."),

  company: Yup.string()
    .trim()
    .max(40, "Company name cannot be longer than 40 characters."),

  notes: Yup.string()
    .trim()
    .max(1000, "Notes cannot be longer than 1000 characters."),
});

const AddClient = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      notes: "",
    },

    validationSchema: clientValidationSchema,

    onSubmit: (values, { setSubmitting, setFieldError }) => {
      const currentClients = getSavedClients();

      const emailAlreadyExists = currentClients.some(
        (client) =>
          String(client.email).toLowerCase() ===
          values.email.trim().toLowerCase()
      );

      if (emailAlreadyExists) {
        setFieldError("email", "This email already belongs to a client.");
        setSubmitting(false);
        return;
      }

      const newClient = {
        id: `client-${Date.now()}`,
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone.trim(),
        company: values.company.trim(),
        notes: values.notes.trim(),
        projects: 0,
        totalValue: 0,
        joinedAt: new Date().toISOString(),
        status: "active",
      };

      const updatedClients = [...currentClients, newClient];

      localStorage.setItem(
        CLIENTS_STORAGE_KEY,
        JSON.stringify(updatedClients)
      );

      toast.success("Client added successfully.");
      setSubmitting(false);
      navigate("/layout/clients");
    },
  });

  const getFieldError = (fieldName) =>
    formik.touched[fieldName] && formik.errors[fieldName];

  return (
    <section className="add-client-page">
      <div className="client-breadcrumb">
        <button type="button" onClick={() => navigate("/layout/clients")}>
          Clients
        </button>

        <FiChevronRight />
        <span>Add Client</span>
      </div>

      <div className="add-client-page__header">
        <div>
          <p className="clients-page__eyebrow">CRM Workspace</p>
          <h1>Add New Client</h1>
          <p>Create a client profile and keep their contact information in one place.</p>
        </div>

        <div className="add-client-page__icon">
          <FiUserPlus />
        </div>
      </div>

      <form className="client-form-card" onSubmit={formik.handleSubmit} noValidate>
        <div className="client-form-section">
          <div className="client-form-section__title">
            <h2>Client Information</h2>
            <p>Basic details used to identify and contact this client.</p>
          </div>

          <div className="client-form-grid">
            <div className="client-form-group">
              <label htmlFor="name">Client Name</label>

              <input
                id="name"
                name="name"
                type="text"
                placeholder="e.g. Olivia Rhye"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={getFieldError("name") ? "has-error" : ""}
              />

              {getFieldError("name") && (
                <small className="client-form-error">{formik.errors.name}</small>
              )}
            </div>

            <div className="client-form-group">
              <label htmlFor="company">Company</label>

              <input
                id="company"
                name="company"
                type="text"
                placeholder="e.g. Layers Inc."
                value={formik.values.company}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className={getFieldError("company") ? "has-error" : ""}
              />

              {getFieldError("company") && (
                <small className="client-form-error">
                  {formik.errors.company}
                </small>
              )}
            </div>
          </div>
        </div>

        <div className="client-form-section">
          <div className="client-form-section__title">
            <h2>Contact Details</h2>
            <p>These details will be displayed on the client profile and invoice records.</p>
          </div>

          <div className="client-form-grid">
            <div className="client-form-group">
              <label htmlFor="email">Email Address</label>

              <div className="client-form-input-icon">
                <FiMail />

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="client@example.com"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={getFieldError("email") ? "has-error" : ""}
                />
              </div>

              {getFieldError("email") && (
                <small className="client-form-error">{formik.errors.email}</small>
              )}
            </div>

            <div className="client-form-group">
              <label htmlFor="phone">Phone Number</label>

              <div className="client-form-input-icon">
                <FiPhone />

                <input
                  id="phone"
                  name="phone"
                  type="text"
                  placeholder="+20 10 0000 0000"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={getFieldError("phone") ? "has-error" : ""}
                />
              </div>

              {getFieldError("phone") && (
                <small className="client-form-error">{formik.errors.phone}</small>
              )}
            </div>
          </div>
        </div>

        <div className="client-form-section client-form-section--last">
          <div className="client-form-section__title">
            <h2>Notes</h2>
            <p>Add anything useful about the client, their preferences, or their current work.</p>
          </div>

          <div className="client-form-group">
            <div className="client-form-label-row">
              <label htmlFor="notes">Internal Notes</label>
              <span>{formik.values.notes.length}/1000</span>
            </div>

            <textarea
              id="notes"
              name="notes"
              placeholder="Write a short note about this client..."
              value={formik.values.notes}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={getFieldError("notes") ? "has-error" : ""}
            />

            {getFieldError("notes") && (
              <small className="client-form-error">{formik.errors.notes}</small>
            )}
          </div>
        </div>

        <div className="client-form-actions">
          <button
            type="button"
            className="clients-button clients-button--secondary"
            onClick={() => navigate("/layout/clients")}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="clients-button clients-button--primary"
            disabled={formik.isSubmitting}
          >
            <FiPlus />
            {formik.isSubmitting ? "Saving..." : "Add Client"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default AddClient;
