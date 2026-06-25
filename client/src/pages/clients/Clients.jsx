/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiBriefcase,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiMail,
  FiPlus,
  FiSearch,
  FiTrash2,
  FiUsers,
} from "react-icons/fi";
import { success, failed } from "../../assets/utils/Toasts";
import "./Clients.css";

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const getInitials = (name) =>
  String(name || "Client")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

const PAGE_SIZE = 6;

const STATUS_OPTIONS = ["lead", "active", "inactive"];

const Clients = () => {
  const navigate = useNavigate();

  const [clients, setClients] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [sortBy, setSortBy] = useState("-createdAt");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState({});

  const [totalClients, setTotalClients] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [activeClientsCount, setActiveClientsCount] = useState(0);

  const fetchClientDetails = async (clientId) => {
    try {
      setLoadingDetails((prev) => ({ ...prev, [clientId]: true }));

      const token = localStorage.getItem("token");
      if (!token) throw new Error("Please login");

      const url = `http://localhost:5000/api/v1/clients/${clientId}/details`;
      console.log(`Fetching details for client ${clientId} from:`, url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to fetch client details`);
      }

      const result = await response.json();
      console.log("Client details response:", result);

      const stats = result.stats || {};

      setClients((prevClients) =>
        prevClients.map((client) =>
          client.id === clientId
            ? {
                ...client,
                projects: stats.totalProjects || 0,
                totalValue: stats.totalValue || 0,
              }
            : client,
        ),
      );

      return result;
    } catch (err) {
      console.error(`Error fetching details for client ${clientId}:`, err);
      setClients((prevClients) =>
        prevClients.map((client) =>
          client.id === clientId
            ? {
                ...client,
                projects: 0,
                totalValue: 0,
              }
            : client,
        ),
      );
    } finally {
      setLoadingDetails((prev) => ({ ...prev, [clientId]: false }));
    }
  };

  const fetchClients = async (page = 1, search = "", sort = "-createdAt") => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      const userData = localStorage.getItem("user");

      if (!token || !userData) {
        throw new Error("Please login to view clients");
      }

      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", PAGE_SIZE);

      if (search.trim()) {
        params.append("keyword", search.trim());
      }

      if (sort) {
        params.append("sort", sort);
      }

      params.append("fields", "name,email,phone,company,status,createdAt");

      const url = `http://localhost:5000/api/v1/clients?${params.toString()}`;
      console.log("Fetching clients from:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Failed to fetch clients: ${response.statusText}`,
        );
      }

      const result = await response.json();

      const clientsData = Array.isArray(result.data) ? result.data : [];

      const transformedClients = clientsData.map((client) => ({
        id: client._id,
        name: client.name,
        email: client.email,
        phone: client.phone || "No phone number",
        company: client.company || "Independent client",
        notes: client.notes || "",
        projects: 0,
        totalValue: 0,
        joinedAt: client.createdAt || new Date().toISOString(),
        status: client.status || "lead",
        user: client.user,
      }));

      setClients(transformedClients);
      setTotalClients(result.totalDocuments || clientsData.length);

      const activeCount = transformedClients.filter(
        (client) => client.status === "active",
      ).length;
      setActiveClientsCount(activeCount);

      if (result.paginationResult) {
        setCurrentPage(result.paginationResult.currentPage || 1);
        setTotalPages(result.paginationResult.pageCount || 1);
      } else {
        setTotalPages(
          Math.ceil((result.totalDocuments || clientsData.length) / PAGE_SIZE),
        );
      }

      transformedClients.forEach((client) => {
        fetchClientDetails(client.id);
      });
    } catch (err) {
      console.error("Error fetching clients:", err);
      setError(err.message || "Failed to load clients. Please try again.");
      setClients([]);
      setTotalClients(0);
      setTotalPages(1);
      setActiveClientsCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients(1, searchValue, sortBy);
  }, []);

  const changePage = (nextPage) => {
    const validPage = Math.min(Math.max(nextPage, 1), totalPages);
    if (validPage !== currentPage) {
      setCurrentPage(validPage);
      fetchClients(validPage, searchValue, sortBy);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      fetchClients(1, searchValue, sortBy);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchValue]);

  useEffect(() => {
    setCurrentPage(1);
    fetchClients(1, searchValue, sortBy);
  }, [sortBy]);

  const updateClientStatus = async (clientId, newStatus) => {
    try {
      setUpdatingStatus(clientId);

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please login to update client status");
      }

      const url = `http://localhost:5000/api/v1/clients/${clientId}`;
      console.log(`Updating client status at: ${url}`);

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Failed to update client status: ${response.statusText}`,
        );
      }

      const result = await response.json();

      setClients((prevClients) =>
        prevClients.map((client) =>
          client.id === clientId
            ? { ...client, status: result.data?.status || newStatus }
            : client,
        ),
      );

      const oldClient = clients.find((c) => c.id === clientId);
      if (oldClient) {
        setActiveClientsCount((prevCount) => {
          if (oldClient.status !== "active" && newStatus === "active") {
            return prevCount + 1;
          } else if (oldClient.status === "active" && newStatus !== "active") {
            return prevCount - 1;
          }
          return prevCount;
        });
      }

      success(`Client status updated to ${newStatus}`);
    } catch (err) {
      console.error("Error updating client status:", err);
      failed(`Failed to update client status: ${err.message}`);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const deleteClient = async (clientId) => {
    const client = clients.find((item) => item.id === clientId);

    const shouldDelete = window.confirm(
      `Delete ${client?.name || "this client"} from the list?`,
    );

    if (!shouldDelete) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please login to delete clients");
      }

      const url = `http://localhost:5000/api/v1/clients/${clientId}`;
      console.log(`Deleting client at: ${url}`);

      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            `Failed to delete client: ${response.statusText}`,
        );
      }

      success("Client deleted successfully!");
      fetchClients(currentPage, searchValue, sortBy);
    } catch (err) {
      console.error("Error deleting client:", err);
      failed(`Failed to delete client: ${err.message}`);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "lead":
        return "#f59e0b";
      case "active":
        return "#10b981";
      case "inactive":
        return "#6b7280";
      default:
        return "#6b7280";
    }
  };

  if (loading && clients.length === 0) {
    return (
      <section className="clients-page">
        <div className="container">
          <div className="clients-page__header">
            <div>
              <p className="clients-page__eyebrow">CRM Workspace</p>
              <h1>Clients</h1>
              <p>Loading clients...</p>
            </div>
          </div>
          <div className="loading-spinner">Loading...</div>
        </div>
      </section>
    );
  }

  if (error && clients.length === 0) {
    return (
      <section className="clients-page">
        <div className="container">
          <div className="clients-page__header">
            <div>
              <p className="clients-page__eyebrow">CRM Workspace</p>
              <h1>Clients</h1>
              <p>Error loading clients</p>
            </div>
          </div>
          <div className="error-state">
            <p>{error}</p>
            <button
              type="button"
              onClick={() => fetchClients(1, searchValue, sortBy)}
              className="clients-button clients-button--primary"
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="clients-page">
      <div className="container">
        <div className="clients-page__header">
          <div>
            <p className="clients-page__eyebrow">CRM Workspace</p>
            <h1>Clients</h1>
            <p>
              Keep your client relationships, contact details, and project value
              organized.
            </p>
          </div>

          <button
            type="button"
            className="clients-button clients-button--primary"
            onClick={() => navigate("/layout/clients/add-new-client")}
          >
            <FiPlus />
            Add Client
          </button>
        </div>

        <div className="clients-overview">
          <article className="clients-overview-card">
            <div className="clients-overview-card__icon clients-overview-card__icon--blue">
              <FiUsers />
            </div>

            <div>
              <p>Total Clients</p>
              <strong>{totalClients}</strong>
              <span>All clients in system</span>
            </div>
          </article>

          <article className="clients-overview-card">
            <div className="clients-overview-card__icon clients-overview-card__icon--green">
              <FiBriefcase />
            </div>

            <div>
              <p>Active Clients</p>
              <strong>{activeClientsCount}</strong>
              <span>Currently active on this page</span>
            </div>
          </article>

          <article className="clients-overview-card">
            <div className="clients-overview-card__icon clients-overview-card__icon--orange">
              <FiMail />
            </div>

            <div>
              <p>New This Month</p>
              <strong>
                {
                  clients.filter((client) => {
                    const date = new Date(client.joinedAt);
                    return date.getMonth() === new Date().getMonth();
                  }).length
                }
              </strong>
              <span>Recently added on this page</span>
            </div>
          </article>
        </div>

        <div className="clients-toolbar">
          <label className="clients-search">
            <FiSearch />
            <input
              type="search"
              placeholder="Search clients by name, company or email..."
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
            />
          </label>

          <div className="clients-toolbar__right">
            <label className="clients-sort">
              <span>Sort by:</span>

              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
              >
                <option value="-createdAt">Newest Added</option>
                <option value="name">Client Name</option>
                <option value="-totalValue">Client Value</option>
                <option value="-projects">Projects Count</option>
              </select>

              <FiChevronDown />
            </label>
          </div>
        </div>

        {loading && clients.length > 0 && (
          <div className="loading-overlay">Loading...</div>
        )}

        <div className="clients-table-card">
          <div className="clients-table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Company</th>
                  <th>Contact</th>
                  <th>Projects</th>
                  <th>Total Value</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {clients.length ? (
                  clients.map((client) => (
                    <tr key={client.id}>
                      <td>
                        <div className="clients-table-profile">
                          <span className="client-avatar">
                            {getInitials(client.name)}
                          </span>

                          <div>
                            <strong>{client.name}</strong>
                            <small>{client.email}</small>
                          </div>
                        </div>
                      </td>

                      <td>{client.company || "—"}</td>
                      <td>{client.phone || "—"}</td>
                      <td>
                        {loadingDetails[client.id] ? (
                          <span className="loading-dots">...</span>
                        ) : (
                          client.projects || 0
                        )}
                      </td>
                      <td>
                        {loadingDetails[client.id] ? (
                          <span className="loading-dots">...</span>
                        ) : (
                          formatCurrency(client.totalValue)
                        )}
                      </td>

                      <td>
                        <div className="client-status-dropdown-wrapper">
                          <select
                            className={`client-status client-status--${client.status}`}
                            value={client.status}
                            onChange={(e) =>
                              updateClientStatus(client.id, e.target.value)
                            }
                            disabled={updatingStatus === client.id}
                            style={{
                              backgroundColor: getStatusColor(client.status),
                              color: "white",
                              border: "none",
                              padding: "4px 12px",
                              borderRadius: "12px",
                              fontSize: "12px",
                              fontWeight: "500",
                              cursor:
                                updatingStatus === client.id
                                  ? "wait"
                                  : "pointer",
                              textTransform: "capitalize",
                              minWidth: "70px",
                              appearance: "auto",
                            }}
                          >
                            {STATUS_OPTIONS.map((status) => (
                              <option
                                key={status}
                                value={status}
                                style={{
                                  backgroundColor: "white",
                                  color: "black",
                                }}
                              >
                                {status}
                              </option>
                            ))}
                          </select>
                          {updatingStatus === client.id && (
                            <span className="status-updating-spinner">⟳</span>
                          )}
                        </div>
                      </td>

                      <td className="clients-table-action">
                        <button
                          type="button"
                          onClick={() => deleteClient(client.id)}
                          title={`Delete ${client.name}`}
                          aria-label={`Delete ${client.name}`}
                          disabled={updatingStatus === client.id}
                        >
                          <FiTrash2 />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="clients-table-empty">
                      No clients match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {totalClients > 0 && (
          <div className="clients-pagination">
            <p>
              Showing {(currentPage - 1) * PAGE_SIZE + 1}–
              {Math.min(currentPage * PAGE_SIZE, totalClients)} of{" "}
              {totalClients} clients
            </p>

            <div>
              <button
                type="button"
                onClick={() => changePage(currentPage - 1)}
                disabled={currentPage === 1 || loading}
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
                disabled={currentPage === totalPages || loading}
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

export default Clients;
