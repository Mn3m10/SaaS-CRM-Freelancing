/* eslint-disable no-unused-vars */
import React from "react";

import {
  FiCalendar,
  FiChevronRight,
  FiDollarSign,
  FiFileText,
  FiPlus,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
const AddInvoiceForm = ({
  formik,
  getFieldError,
  availableProjects,
  projectsError,
  clientsError,
  isLoadingProjects,
  isLoadingClients,
  clients,
}) => {
  const navigate = useNavigate();
  const getToday = () => new Date().toISOString().split("T")[0];
  return (
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
              disabled={isLoadingClients}
              className={getFieldError("clientId") ? "has-error" : ""}
            >
              <option value="">
                {isLoadingClients ? "Loading clients..." : "Select a client"}
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
  );
};

export default AddInvoiceForm;
