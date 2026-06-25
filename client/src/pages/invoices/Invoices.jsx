/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FiCalendar,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiDollarSign,
  FiFileText,
  FiPlus,
  FiSearch,
  FiEdit,
  FiTrash2,
} from "react-icons/fi";
import "./Invoices.css";
import { success, failed } from "../../assets/utils/Toasts";

const API_BASE_URL = "http://localhost:5000/api/v1";
const PAGE_SIZE = 6;

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

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const formatDate = (dateValue) => {
  if (!dateValue) return "—";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

const getStatusLabel = (status) => {
  const labels = {
    paid: "Paid",
    pending: "Pending",
    overdue: "Overdue",
    cancelled: "Cancelled",
  };
  return labels[status] || status;
};

const STATUS_OPTIONS = ["pending", "paid", "overdue", "cancelled"];

const Invoices = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [invoices, setInvoices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("dueDate");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalInvoices, setTotalInvoices] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(PAGE_SIZE);
  const [deletingInvoiceId, setDeletingInvoiceId] = useState(null);
  const [updatingInvoiceId, setUpdatingInvoiceId] = useState(null);

  const loadInvoices = async (
    page = 1,
    status = "all",
    sort = "dueDate",
    search = "",
  ) => {
    setIsLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", limit);

      if (status !== "all") {
        params.append("status", status);
      }

      if (search.trim()) {
        params.append("search", search.trim());
      }

      if (sort === "dueDate") {
        params.append("sort", "dueDate");
      } else if (sort === "newest") {
        params.append("sort", "-createdAt");
      } else if (sort === "amount") {
        params.append("sort", "-amount");
      } else if (sort === "client") {
        params.append("sort", "client.name");
      }

      const response = await fetch(
        `${API_BASE_URL}/invoices?${params.toString()}`,
        {
          headers: getAuthHeaders(),
        },
      );

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(getApiError(payload));
      }

      const invoicesData = Array.isArray(payload.data) ? payload.data : [];

      setInvoices(invoicesData);
      setTotalInvoices(payload["total documents"] || invoicesData.length);

      if (payload.paginationResult) {
        setCurrentPage(payload.paginationResult.currentPage || 1);
        setTotalPages(payload.paginationResult.pageCount || 1);
        setLimit(payload.paginationResult.limit || PAGE_SIZE);
      } else {
        setTotalPages(Math.ceil(invoicesData.length / limit));
      }
    } catch (error) {
      setError(error.message || "Unable to load invoices.");
      setInvoices([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices(1, statusFilter, sortBy, searchValue);
  }, []);

  useEffect(() => {
    if (location.state?.refresh) {
      loadInvoices(currentPage, statusFilter, sortBy, searchValue);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    loadInvoices(1, statusFilter, sortBy, searchValue);
    setCurrentPage(1);
  }, [statusFilter, sortBy]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage === 1) {
        loadInvoices(1, statusFilter, sortBy, searchValue);
      } else {
        setCurrentPage(1);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue]);

  const updateInvoiceStatus = async (invoiceId, newStatus) => {
    setUpdatingInvoiceId(invoiceId);

    try {
      const response = await fetch(`${API_BASE_URL}/invoices/${invoiceId}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(getApiError(payload));
      }

      setInvoices((prevInvoices) =>
        prevInvoices.map((invoice) =>
          invoice._id === invoiceId || invoice.id === invoiceId
            ? { ...invoice, status: newStatus }
            : invoice,
        ),
      );

      success(`Invoice status updated to ${getStatusLabel(newStatus)}`);
    } catch (error) {
      console.error("Error updating invoice status:", error);
      failed(error.message || "Failed to update invoice status");
    } finally {
      setUpdatingInvoiceId(null);
    }
  };

  const deleteInvoice = async (invoiceId) => {
    const invoice = invoices.find(
      (inv) => inv._id === invoiceId || inv.id === invoiceId,
    );

    if (
      !window.confirm(
        `Are you sure you want to delete invoice "${invoice?.invoiceNumber || "this invoice"}"?`,
      )
    ) {
      return;
    }

    setDeletingInvoiceId(invoiceId);

    try {
      const response = await fetch(`${API_BASE_URL}/invoices/${invoiceId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const payload = await response.json();
        throw new Error(getApiError(payload));
      }

      setInvoices((prevInvoices) =>
        prevInvoices.filter(
          (inv) => inv._id !== invoiceId && inv.id !== invoiceId,
        ),
      );

      success("Invoice deleted successfully");
      loadInvoices(currentPage, statusFilter, sortBy, searchValue);
    } catch (error) {
      console.error("Error deleting invoice:", error);
      failed(error.message || "Failed to delete invoice");
    } finally {
      setDeletingInvoiceId(null);
    }
  };

  const handleStatusChange = (invoiceId, currentStatus) => {
    const currentIndex = STATUS_OPTIONS.indexOf(currentStatus);
    const nextIndex = (currentIndex + 1) % STATUS_OPTIONS.length;
    const newStatus = STATUS_OPTIONS[nextIndex];
    updateInvoiceStatus(invoiceId, newStatus);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      loadInvoices(newPage, statusFilter, sortBy, searchValue);
    }
  };

  const pageInvoices = invoices;
  const startIndex = (currentPage - 1) * limit;

  const paidAmount = invoices
    .filter((invoice) => invoice.status === "paid")
    .reduce((total, invoice) => total + Number(invoice.amount || 0), 0);

  const pendingAmount = invoices
    .filter((invoice) => ["pending", "overdue"].includes(invoice.status))
    .reduce((total, invoice) => total + Number(invoice.amount || 0), 0);

  const overdueAmount = invoices
    .filter((invoice) => invoice.status === "overdue")
    .reduce((total, invoice) => total + Number(invoice.amount || 0), 0);

  return (
    <section className="invoices-page">
      <div className="container">
        <div className="invoices-page__header">
          <div>
            <p className="invoices-page__eyebrow">Financial Workspace</p>
            <h1>Invoices</h1>
            <p>
              Create, track, and organize invoices for all your client projects.
            </p>
          </div>

          <button
            type="button"
            className="invoices-button invoices-button--primary"
            onClick={() => navigate("/layout/invoices/add-new-invoice")}
          >
            <FiPlus />
            Create Invoice
          </button>
        </div>

        <div className="invoices-summary">
          <article className="invoice-summary-card">
            <div className="invoice-summary-card__icon invoice-summary-card__icon--blue">
              <FiDollarSign />
            </div>

            <div>
              <p>Total Paid</p>
              <strong>{formatCurrency(paidAmount)}</strong>
              <span>Received from paid invoices</span>
            </div>
          </article>

          <article className="invoice-summary-card">
            <div className="invoice-summary-card__icon invoice-summary-card__icon--yellow">
              <FiClock />
            </div>

            <div>
              <p>Outstanding</p>
              <strong>{formatCurrency(pendingAmount)}</strong>
              <span>Pending and overdue invoices</span>
            </div>
          </article>

          <article className="invoice-summary-card">
            <div className="invoice-summary-card__icon invoice-summary-card__icon--red">
              <FiFileText />
            </div>

            <div>
              <p>Overdue</p>
              <strong>{formatCurrency(overdueAmount)}</strong>
              <span>
                {
                  invoices.filter((invoice) => invoice.status === "overdue")
                    .length
                }{" "}
                invoices need attention
              </span>
            </div>
          </article>
        </div>

        <div className="invoices-toolbar">
          <label className="invoices-search">
            <FiSearch />
            <input
              type="search"
              placeholder="Search by invoice number, client or project..."
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
            />
          </label>

          <div className="invoices-toolbar__filters">
            <label className="invoices-select">
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
                <option value="cancelled">Cancelled</option>
              </select>

              <FiChevronDown />
            </label>

            <label className="invoices-sort">
              <span>Sort by:</span>

              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
              >
                <option value="dueDate">Due Date</option>
                <option value="newest">Newest</option>
                <option value="amount">Amount</option>
                <option value="client">Client</option>
              </select>

              <FiChevronDown />
            </label>
          </div>
        </div>

        {error && (
          <div className="invoices-message invoices-message--error">
            {error}
          </div>
        )}

        <div className="invoices-table-card">
          <div className="invoices-table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Invoice Number</th>
                  <th>Client</th>
                  <th>Related Project</th>
                  <th>Amount</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="7" className="invoices-table-empty">
                      Loading invoices...
                    </td>
                  </tr>
                ) : pageInvoices.length ? (
                  pageInvoices.map((invoice) => (
                    <tr key={invoice._id || invoice.id}>
                      <td>
                        <div className="invoice-number-cell">
                          <span>
                            <FiFileText />
                          </span>
                          <strong>{invoice.invoiceNumber}</strong>
                        </div>
                      </td>

                      <td>
                        <div className="invoice-client-cell">
                          <span>
                            {invoice.client?.name?.slice(0, 1).toUpperCase() ||
                              "?"}
                          </span>
                          <p>{invoice.client?.name || "No client"}</p>
                        </div>
                      </td>

                      <td>{invoice.project?.title || "No project"}</td>

                      <td>
                        <strong className="invoice-amount">
                          {formatCurrency(invoice.amount)}
                        </strong>
                      </td>

                      <td>
                        <span className="invoice-date">
                          <FiCalendar />
                          {formatDate(invoice.dueDate)}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`invoice-status invoice-status--${invoice.status}`}
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            handleStatusChange(
                              invoice._id || invoice.id,
                              invoice.status,
                            )
                          }
                          title="Click to change status"
                        >
                          {updatingInvoiceId === (invoice._id || invoice.id)
                            ? "Updating..."
                            : getStatusLabel(invoice.status)}
                        </span>
                      </td>

                      <td>
                        <div className="invoice-actions">
                          <button
                            type="button"
                            className="invoice-action-button invoice-action-button--edit"
                            onClick={() => {
                              navigate(
                                `/layout/invoices/edit/${invoice._id || invoice.id}`,
                              );
                            }}
                            title="Edit invoice"
                          >
                            <FiEdit />
                          </button>
                          <button
                            type="button"
                            className="invoice-action-button invoice-action-button--delete"
                            onClick={() =>
                              deleteInvoice(invoice._id || invoice.id)
                            }
                            disabled={
                              deletingInvoiceId === (invoice._id || invoice.id)
                            }
                            title="Delete invoice"
                          >
                            {deletingInvoiceId ===
                            (invoice._id || invoice.id) ? (
                              "..."
                            ) : (
                              <FiTrash2 />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="invoices-table-empty">
                      No invoices match the selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {!isLoading && totalInvoices > 0 && (
          <div className="invoices-pagination">
            <p>
              Showing {startIndex + 1}–
              {Math.min(startIndex + limit, totalInvoices)} of {totalInvoices}{" "}
              invoices
            </p>

            <div>
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                <FiChevronLeft />
              </button>

              <span>
                {currentPage} / {totalPages}
              </span>

              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                aria-label="Next page"
              >
                <FiChevronRight />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Invoices;
