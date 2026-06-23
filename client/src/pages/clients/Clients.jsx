import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiBriefcase,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiGrid,
  FiList,
  FiMail,
  FiPhone,
  FiPlus,
  FiSearch,
  FiTrash2,
  FiUsers,
} from "react-icons/fi";
import "./Clients.css";

const CLIENTS_STORAGE_KEY = "saas_crm_demo_clients";
const PAGE_SIZE = 6;

const DEMO_CLIENTS = [
  {
    id: "client-1",
    name: "Olivia Rhye",
    email: "olivia@layers.co",
    phone: "+1 202 555 0148",
    company: "Layers Inc.",
    notes: "Main contact for the website redesign project.",
    projects: 3,
    totalValue: 18500,
    joinedAt: "2026-01-15",
    status: "active",
  },
  {
    id: "client-2",
    name: "Phoenix Baker",
    email: "phoenix@quotient.co",
    phone: "+1 202 555 0191",
    company: "Quotient",
    notes: "Monthly social media and content work.",
    projects: 2,
    totalValue: 9200,
    joinedAt: "2026-02-03",
    status: "active",
  },
  {
    id: "client-3",
    name: "Lana Steiner",
    email: "lana@catalog.co",
    phone: "+1 202 555 0176",
    company: "Catalog",
    notes: "Brand identity and marketing materials.",
    projects: 1,
    totalValue: 6400,
    joinedAt: "2026-02-18",
    status: "active",
  },
  {
    id: "client-4",
    name: "Demi Wilkinson",
    email: "demi@openbox.co",
    phone: "+1 202 555 0132",
    company: "Openbox Studio",
    notes: "Waiting for approval on the new proposal.",
    projects: 1,
    totalValue: 3200,
    joinedAt: "2026-03-06",
    status: "active",
  },
  {
    id: "client-5",
    name: "Candice Wu",
    email: "candice@sisyphus.co",
    phone: "+1 202 555 0163",
    company: "Sisyphus",
    notes: "Product launch campaign and visual assets.",
    projects: 4,
    totalValue: 24400,
    joinedAt: "2026-03-20",
    status: "active",
  },
  {
    id: "client-6",
    name: "Natali Craig",
    email: "natali@wework.com",
    phone: "+1 202 555 0108",
    company: "WeWork",
    notes: "Paused until the next quarter.",
    projects: 0,
    totalValue: 0,
    joinedAt: "2026-04-01",
    status: "inactive",
  },
  {
    id: "client-7",
    name: "Drew Cano",
    email: "drew@wildcard.com",
    phone: "+1 202 555 0124",
    company: "Wildcard",
    notes: "Landing page optimization project.",
    projects: 2,
    totalValue: 7800,
    joinedAt: "2026-04-12",
    status: "active",
  },
];

const getClientsFromStorage = () => {
  try {
    const savedClients = JSON.parse(
      localStorage.getItem(CLIENTS_STORAGE_KEY) || "[]"
    );

    if (Array.isArray(savedClients) && savedClients.length > 0) {
      return savedClients;
    }
  } catch (error) {
    console.error("Could not read clients from local storage.", error);
  }

  localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(DEMO_CLIENTS));
  return DEMO_CLIENTS;
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

const getInitials = (name) =>
  String(name || "Client")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

const Clients = () => {
  const navigate = useNavigate();

  const [clients, setClients] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const loadClients = () => {
      setClients(getClientsFromStorage());
    };

    loadClients();

    window.addEventListener("storage", loadClients);

    return () => {
      window.removeEventListener("storage", loadClients);
    };
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue, sortBy]);

  const filteredClients = useMemo(() => {
    const search = searchValue.trim().toLowerCase();

    const result = clients.filter((client) => {
      const searchableText = [
        client.name,
        client.email,
        client.company,
        client.phone,
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(search);
    });

    return [...result].sort((firstClient, secondClient) => {
      if (sortBy === "name") {
        return firstClient.name.localeCompare(secondClient.name);
      }

      if (sortBy === "value") {
        return Number(secondClient.totalValue || 0) - Number(firstClient.totalValue || 0);
      }

      if (sortBy === "projects") {
        return Number(secondClient.projects || 0) - Number(firstClient.projects || 0);
      }

      return (
        new Date(secondClient.joinedAt).getTime() -
        new Date(firstClient.joinedAt).getTime()
      );
    });
  }, [clients, searchValue, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredClients.length / PAGE_SIZE));
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const currentClients = filteredClients.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  const totalValue = clients.reduce(
    (total, client) => total + Number(client.totalValue || 0),
    0
  );

  const activeClients = clients.filter(
    (client) => client.status === "active"
  ).length;

  const deleteClient = (clientId) => {
    const client = clients.find((item) => item.id === clientId);

    const shouldDelete = window.confirm(
      `Delete ${client?.name || "this client"} from the list?`
    );

    if (!shouldDelete) {
      return;
    }

    const updatedClients = clients.filter((client) => client.id !== clientId);

    setClients(updatedClients);
    localStorage.setItem(CLIENTS_STORAGE_KEY, JSON.stringify(updatedClients));
  };

  const changePage = (nextPage) => {
    setCurrentPage(Math.min(Math.max(nextPage, 1), totalPages));
  };

  return (
    <section className="clients-page">
      <div className="clients-page__header">
        <div>
          <p className="clients-page__eyebrow">CRM Workspace</p>
          <h1>Clients</h1>
          <p>Keep your client relationships, contact details, and project value organized.</p>
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
            <strong>{clients.length}</strong>
            <span>{activeClients} active clients</span>
          </div>
        </article>

        <article className="clients-overview-card">
          <div className="clients-overview-card__icon clients-overview-card__icon--green">
            <FiBriefcase />
          </div>

          <div>
            <p>Total Client Value</p>
            <strong>{formatCurrency(totalValue)}</strong>
            <span>Across all active projects</span>
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
            <span>Recently added clients</span>
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
              <option value="newest">Newest Added</option>
              <option value="name">Client Name</option>
              <option value="value">Client Value</option>
              <option value="projects">Projects Count</option>
            </select>

            <FiChevronDown />
          </label>

          <div className="clients-view-toggle">
            <button
              type="button"
              className={viewMode === "grid" ? "is-active" : ""}
              onClick={() => setViewMode("grid")}
              title="Grid view"
              aria-label="Grid view"
            >
              <FiGrid />
            </button>

            <button
              type="button"
              className={viewMode === "list" ? "is-active" : ""}
              onClick={() => setViewMode("list")}
              title="List view"
              aria-label="List view"
            >
              <FiList />
            </button>
          </div>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="clients-grid">
          {currentClients.length ? (
            currentClients.map((client) => (
              <article className="client-card" key={client.id}>
                <div className="client-card__top">
                  <span className={`client-status client-status--${client.status}`}>
                    {client.status}
                  </span>

                  <button
                    type="button"
                    className="client-delete-button"
                    onClick={() => deleteClient(client.id)}
                    title={`Delete ${client.name}`}
                    aria-label={`Delete ${client.name}`}
                  >
                    <FiTrash2 />
                  </button>
                </div>

                <div className="client-card__profile">
                  <span className="client-avatar">{getInitials(client.name)}</span>

                  <div>
                    <h3>{client.name}</h3>
                    <p>{client.company || "Independent client"}</p>
                  </div>
                </div>

                <div className="client-card__contact">
                  <p>
                    <FiMail />
                    <span>{client.email}</span>
                  </p>

                  <p>
                    <FiPhone />
                    <span>{client.phone || "No phone number"}</span>
                  </p>
                </div>

                <div className="client-card__stats">
                  <div>
                    <span>Projects</span>
                    <strong>{client.projects || 0}</strong>
                  </div>

                  <div>
                    <span>Total Value</span>
                    <strong>{formatCurrency(client.totalValue)}</strong>
                  </div>
                </div>

                <div className="client-card__footer">
                  <span>Joined {formatDate(client.joinedAt)}</span>
                  <button
                    type="button"
                    onClick={() => window.alert(`Client details for ${client.name}`)}
                  >
                    View Details
                  </button>
                </div>
              </article>
            ))
          ) : (
            <div className="clients-empty-state">
              <FiUsers />
              <h3>No clients found</h3>
              <p>Try another search term or add a new client.</p>
            </div>
          )}
        </div>
      ) : (
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
                  <th />
                </tr>
              </thead>

              <tbody>
                {currentClients.length ? (
                  currentClients.map((client) => (
                    <tr key={client.id}>
                      <td>
                        <div className="clients-table-profile">
                          <span className="client-avatar">{getInitials(client.name)}</span>

                          <div>
                            <strong>{client.name}</strong>
                            <small>{client.email}</small>
                          </div>
                        </div>
                      </td>

                      <td>{client.company || "—"}</td>
                      <td>{client.phone || "—"}</td>
                      <td>{client.projects || 0}</td>
                      <td>{formatCurrency(client.totalValue)}</td>

                      <td>
                        <span className={`client-status client-status--${client.status}`}>
                          {client.status}
                        </span>
                      </td>

                      <td className="clients-table-action">
                        <button
                          type="button"
                          onClick={() => deleteClient(client.id)}
                          title={`Delete ${client.name}`}
                          aria-label={`Delete ${client.name}`}
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
      )}

      {filteredClients.length > 0 && (
        <div className="clients-pagination">
          <p>
            Showing {startIndex + 1}–
            {Math.min(startIndex + PAGE_SIZE, filteredClients.length)} of{" "}
            {filteredClients.length} clients
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

export default Clients;
