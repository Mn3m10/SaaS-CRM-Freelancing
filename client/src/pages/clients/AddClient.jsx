import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import { success, failed } from "../../assets/utils/Toasts";
import {
  FiChevronRight,
  FiMail,
  FiPhone,
  FiPlus,
  FiUserPlus,
} from "react-icons/fi";
import "./Clients.css";
import { clientValidationSchema } from "../../assets/utils/Validations";

const API_BASE_URL = "http://localhost:5000/api/v1/clients";

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

    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");

        // Validate token and user data
        if (!token) {
          failed("Please login to add a client");
          setSubmitting(false);
          navigate("/login");
          return;
        }

        if (!userData) {
          failed("User data not found. Please login again.");
          setSubmitting(false);
          navigate("/login");
          return;
        }

        const user = JSON.parse(userData);

        // Validate user has an _id
        if (!user._id) {
          failed("Invalid user data. Please login again.");
          setSubmitting(false);
          navigate("/login");
          return;
        }

        // Prepare the data - remove user field as it will be added by the backend
        const clientData = {
          name: values.name.trim(),
          email: values.email.trim().toLowerCase(), // Normalize email
          phone: values.phone.trim(),
          company: values.company.trim(),
          notes: values.notes.trim(),
          // Don't send user field - backend will add it from the token
        };

        const response = await fetch(API_BASE_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(clientData),
        });

        const data = await response.json();

        if (!response.ok) {
          // Handle specific error cases
          if (response.status === 400) {
            if (data.message?.toLowerCase().includes("email")) {
              setFieldError("email", "This email already belongs to a client.");
              failed("This email already belongs to a client.");
            } else if (data.message?.toLowerCase().includes("validation")) {
              // Handle validation errors from backend
              if (data.errors) {
                Object.keys(data.errors).forEach((field) => {
                  setFieldError(field, data.errors[field]);
                });
              }
              failed(
                data.message || "Validation failed. Please check your input.",
              );
            } else {
              failed(
                data.message || "Failed to create client. Please try again.",
              );
            }
          } else if (response.status === 401) {
            failed("Session expired. Please login again.");
            navigate("/login");
          } else if (response.status === 403) {
            failed("You don't have permission to add clients.");
          } else {
            failed(
              data.message || "Failed to create client. Please try again.",
            );
          }
          setSubmitting(false);
          return;
        }

        success("Client added successfully.");
        setSubmitting(false);
        navigate("/layout/clients");
      } catch (error) {
        console.error("Error creating client:", error);
        failed(error.message || "Failed to create client. Please try again.");
        setSubmitting(false);
      }
    },
  });

  const getFieldError = (fieldName) =>
    formik.touched[fieldName] && formik.errors[fieldName];

  return (
    <section className="add-client-page">
      <div className="container">
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
            <p>
              Create a client profile and keep their contact information in one
              place.
            </p>
          </div>

          <div className="add-client-page__icon">
            <FiUserPlus />
          </div>
        </div>

        <form
          className="client-form-card"
          onSubmit={formik.handleSubmit}
          noValidate
        >
          <div className="client-form-section">
            <div className="client-form-section__title">
              <h2>Client Information</h2>
              <p>Basic details used to identify and contact this client.</p>
            </div>

            <div className="client-form-grid">
              <div className="client-form-group">
                <label htmlFor="name">Client Name *</label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="e.g. Olivia Rhye"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={getFieldError("name") ? "has-error" : ""}
                  disabled={formik.isSubmitting}
                />

                {getFieldError("name") && (
                  <small className="client-form-error">
                    {formik.errors.name}
                  </small>
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
                  disabled={formik.isSubmitting}
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
              <p>
                These details will be displayed on the client profile and
                invoice records.
              </p>
            </div>

            <div className="client-form-grid">
              <div className="client-form-group">
                <label htmlFor="email">Email Address *</label>

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
                    disabled={formik.isSubmitting}
                  />
                </div>

                {getFieldError("email") && (
                  <small className="client-form-error">
                    {formik.errors.email}
                  </small>
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
                    disabled={formik.isSubmitting}
                  />
                </div>

                {getFieldError("phone") && (
                  <small className="client-form-error">
                    {formik.errors.phone}
                  </small>
                )}
              </div>
            </div>
          </div>

          <div className="client-form-section client-form-section--last">
            <div className="client-form-section__title">
              <h2>Notes</h2>
              <p>
                Add anything useful about the client, their preferences, or
                their current work.
              </p>
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
                disabled={formik.isSubmitting}
                maxLength="1000"
              />

              {getFieldError("notes") && (
                <small className="client-form-error">
                  {formik.errors.notes}
                </small>
              )}
            </div>
          </div>

          <div className="client-form-actions">
            <button
              type="button"
              className="clients-button clients-button--secondary"
              onClick={() => navigate("/layout/clients")}
              disabled={formik.isSubmitting}
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
      </div>
    </section>
  );
};

export default AddClient;
