import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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
} from "react-icons/fi";
import "./Invoices.css";

const INVOICES_STORAGE_KEY = "saas_crm_demo_invoices";
const PAGE_SIZE = 6;

const DEMO_INVOICES = [
  {
    id: "invoice-1",
    invoiceNumber: "INV-1001",
    clientId: "client-1",
    clientName: "Olivia Rhye",
    projectId: "project-1",
    projectName: "Website Redesign",
    amount: 4200,
    status: "paid",
    dueDate: "2026-05-10",
    issuedAt: "2026-04-20",
  },
  {
    id: "invoice-2",
    invoiceNumber: "INV-1002",
    clientId: "client-2",
    clientName: "Phoenix Baker",
    projectId: "project-2",
    projectName: "Content Strategy",
    amount: 1850,
    status: "pending",
    dueDate: "2026-06-30",
    issuedAt: "2026-06-01",
  },
  {
    id: "invoice-3",
    invoiceNumber: "INV-1003",
    clientId: "client-3",
    clientName: "Lana Steiner",
    projectId: "project-3",
    projectName: "Brand Identity",
    amount: 3200,
    status: "overdue",
    dueDate: "2026-05-26",
    issuedAt: "2026-05-01",
  },
  {
    id: "invoice-4",
    invoiceNumber: "INV-1004",
    clientId: "client-4",
    clientName: "Demi Wilkinson",
    projectId: "project-4",
    projectName: "Mobile App Design",
    amount: 2750,
    status: "pending",
    dueDate: "2026-07-08",
    issuedAt: "2026-06-08",
  },
  {
    id: "invoice-5",
    invoiceNumber: "INV-1005",
    clientId: "client-5",
    clientName: "Candice Wu",
    projectId: "project-5",
    projectName: "Product Launch",
    amount: 5100,
    status: "paid",
    dueDate: "2026-06-05",
    issuedAt: "2026-05-11",
  },
  {
    id: "invoice-6",
    invoiceNumber: "INV-1006",
    clientId: "client-7",
    clientName: "Drew Cano",
    projectId: "project-6",
    projectName: "Landing Page",
    amount: 1400,
    status: "cancelled",
    dueDate: "2026-06-18",
    issuedAt: "2026-05-29",
  },
];

const getInvoicesFromStorage = () => {
  try {
    const savedInvoices = JSON.parse(
      localStorage.getItem(INVOICES_STORAGE_KEY) || "[]"
    );

    if (Array.isArray(savedInvoices) && savedInvoices.length > 0) {
      return savedInvoices;
    }
  } catch (error) {
    console.error("Could not read invoices from local storage.", error);
  }

  localStorage.setItem(INVOICES_STORAGE_KEY, JSON.stringify(DEMO_INVOICES));
  return DEMO_INVOICES;
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const formatDate = (dateValue) => {
  if (!dateValue) {
    return "—";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

const Invoices = () => {
  const navigate = useNavigate();

  const [invoices, setInvoices] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("dueDate");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadInvoices = () => {
      setInvoices(getInvoicesFromStorage());
    };

    loadInvoices();

    window.addEventListener("storage", loadInvoices);

    return () => {
      window.removeEventListener("storage", loadInvoices);
    };
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue, statusFilter, sortBy]);

  const filteredInvoices = useMemo(() => {
    const search = searchValue.trim().toLowerCase();

    const result = invoices.filter((invoice) => {
      const statusMatches =
        statusFilter === "all" || invoice.status === statusFilter;

      const searchableText = [
        invoice.invoiceNumber,
        invoice.clientName,
        invoice.projectName,
      ]
        .join(" ")
        .toLowerCase();

      return statusMatches && searchableText.includes(search);
    });

    return [...result].sort((firstInvoice, secondInvoice) => {
      if (sortBy === "newest") {
        return (
          new Date(secondInvoice.issuedAt).getTime() -
          new Date(firstInvoice.issuedAt).getTime()
        );
      }

      if (sortBy === "amount") {
        return Number(secondInvoice.amount) - Number(firstInvoice.amount);
      }

      if (sortBy === "client") {
        return firstInvoice.clientName.localeCompare(secondInvoice.clientName);
      }

      return (
        new Date(firstInvoice.dueDate).getTime() -
        new Date(secondInvoice.dueDate).getTime()
      );
    });
  }, [invoices, searchValue, statusFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredInvoices.length / PAGE_SIZE));
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const currentInvoices = filteredInvoices.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  const paidAmount = invoices
    .filter((invoice) => invoice.status === "paid")
    .reduce((total, invoice) => total + Number(invoice.amount || 0), 0);

  const pendingAmount = invoices
    .filter((invoice) =>
      ["pending", "overdue"].includes(invoice.status)
    )
    .reduce((total, invoice) => total + Number(invoice.amount || 0), 0);

  const overdueAmount = invoices
    .filter((invoice) => invoice.status === "overdue")
    .reduce((total, invoice) => total + Number(invoice.amount || 0), 0);

  const changePage = (nextPage) => {
    setCurrentPage(Math.min(Math.max(nextPage, 1), totalPages));
  };

  return (
    <section className="invoices-page">
      <div className="invoices-page__header">
        <div>
          <p className="invoices-page__eyebrow">Financial Workspace</p>
          <h1>Invoices</h1>
          <p>Create, track, and organize invoices for all your client projects.</p>
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
              {invoices.filter((invoice) => invoice.status === "overdue").length}{" "}
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
              </tr>
            </thead>

            <tbody>
              {currentInvoices.length ? (
                currentInvoices.map((invoice) => (
                  <tr key={invoice.id}>
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
                        <span>{invoice.clientName?.slice(0, 1).toUpperCase()}</span>
                        <p>{invoice.clientName}</p>
                      </div>
                    </td>

                    <td>{invoice.projectName}</td>

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
                      <span className={`invoice-status invoice-status--${invoice.status}`}>
                        {invoice.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="invoices-table-empty">
                    No invoices match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {filteredInvoices.length > 0 && (
        <div className="invoices-pagination">
          <p>
            Showing {startIndex + 1}–
            {Math.min(startIndex + PAGE_SIZE, filteredInvoices.length)} of{" "}
            {filteredInvoices.length} invoices
          </p>

          <div>
            <button
              type="button"
              onClick={() => changePage(currentPage - 1)}
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
              onClick={() => changePage(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              <FiChevronRight />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Invoices;
