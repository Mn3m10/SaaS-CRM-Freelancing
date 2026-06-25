import {
  FiMail,
  FiPhone,
  FiPlus,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export const AddClientForm = ({formik , getFieldError}) => {
  const navigate = useNavigate();
  return (
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
            These details will be displayed on the client profile and invoice
            records.
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
                disabled={formik.isSubmitting}
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
          <p>
            Add anything useful about the client, their preferences, or their
            current work.
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
            <small className="client-form-error">{formik.errors.notes}</small>
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
  );
};
