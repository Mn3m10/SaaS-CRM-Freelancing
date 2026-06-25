/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FiCalendar,
  FiCheckCircle,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiPlus,
  FiTrash2,
  FiEdit,
  FiBriefcase,
  FiSearch,
} from "react-icons/fi";
import "./Projects.css";
import { success, failed } from "../../assets/utils/Toasts";

const API_BASE_URL = "http://localhost:5000/api/v1";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token") || "";
  const headers = {
    "Content-Type": "application/json",
  };
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

const PAGE_SIZE = 6;

const formatDate = (dateValue) => {
  if (!dateValue) return "No deadline";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "No deadline";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

const getInitials = (name) => {
  if (!name) return "??";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
};

const getClientName = (client) => {
  if (!client || typeof client !== "object") return "No client";
  return client.name || "No client";
};

const getStatusLabel = (status) => {
  const labels = {
    pending: "Pending",
    completed: "Completed",
    overdue: "Overdue",
    cancelld: "Cancelled",
  };
  return labels[status] || status;
};

const STATUS_OPTIONS = ["pending", "completed", "overdue", "cancelld"];

const Projects = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProjectIds, setSelectedProjectIds] = useState([]);
  const [updatingProjectId, setUpdatingProjectId] = useState(null);
  const [deletingProjectId, setDeletingProjectId] = useState(null);

  const loadProjects = async (page = 1) => {
    setIsLoading(true);
    setLoadError("");

    try {
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", 100);

      if (statusFilter !== "all") {
        params.append("status", statusFilter);
      }

      if (sortBy === "newest") {
        params.append("sort", "-createdAt");
      } else if (sortBy === "oldest") {
        params.append("sort", "createdAt");
      } else if (sortBy === "title") {
        params.append("sort", "title");
      } else if (sortBy === "client") {
        params.append("sort", "client.name");
      }

      const response = await fetch(
        `${API_BASE_URL}/projects?${params.toString()}`,
        {
          headers: getAuthHeaders(),
        },
      );

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(getApiError(payload));
      }

      setProjects(Array.isArray(payload.data) ? payload.data : []);
    } catch (error) {
      setLoadError(error.message || "Unable to load projects right now.");
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjects(1);
  }, []);

  useEffect(() => {
    if (location.state?.refresh) {
      loadProjects(currentPage);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && !isLoading) {
        loadProjects(currentPage);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [isLoading]);

  useEffect(() => {
    const handlePopState = () => {
      loadProjects(currentPage);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    loadProjects(1);
  }, [location.pathname]);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, sortBy]);

  const projectRows = useMemo(() => {
    return projects.map((project) => {
      let projectStatus = project.status || "pending";

      if (projectStatus !== "completed" && projectStatus !== "cancelld") {
        const deadline = project.deadline ? new Date(project.deadline) : null;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (deadline && !Number.isNaN(deadline.getTime()) && deadline < today) {
          projectStatus = "overdue";
        }
      }

      return {
        id: project._id || project.id,
        title: project.title || "Untitled project",
        description: project.description || "",
        deadline: project.deadline || "",
        status: projectStatus,
        clientName: getClientName(project.client),
        client: project.client,
        user: project.user,
        createdAt: project.createdAt,
        originalProject: project,
      };
    });
  }, [projects]);

  const filteredProjects = useMemo(() => {
    let rows = projectRows.filter((project) => {
      const statusMatches =
        statusFilter === "all" || project.status === statusFilter;
      return statusMatches;
    });

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      rows = rows.filter(
        (project) =>
          project.title.toLowerCase().includes(query) ||
          project.clientName.toLowerCase().includes(query) ||
          project.description.toLowerCase().includes(query),
      );
    }

    return [...rows].sort((firstProject, secondProject) => {
      if (sortBy === "title") {
        return firstProject.title.localeCompare(secondProject.title);
      }
      if (sortBy === "client") {
        return firstProject.clientName.localeCompare(secondProject.clientName);
      }
      if (sortBy === "newest") {
        return (
          new Date(secondProject.createdAt) - new Date(firstProject.createdAt)
        );
      }
      if (sortBy === "oldest") {
        return (
          new Date(firstProject.createdAt) - new Date(secondProject.createdAt)
        );
      }
      const firstDeadline = firstProject.deadline
        ? new Date(firstProject.deadline).getTime()
        : Number.MAX_SAFE_INTEGER;
      const secondDeadline = secondProject.deadline
        ? new Date(secondProject.deadline).getTime()
        : Number.MAX_SAFE_INTEGER;
      return firstDeadline - secondDeadline;
    });
  }, [projectRows, statusFilter, sortBy, searchQuery]);

  const statistics = useMemo(() => {
    const totalProjects = projectRows.length;
    const completedProjects = projectRows.filter(
      (project) => project.status === "completed",
    ).length;
    const overdueProjects = projectRows.filter(
      (project) => project.status === "overdue",
    ).length;
    const pendingProjects = projectRows.filter(
      (project) => project.status === "pending",
    ).length;
    const cancelledProjects = projectRows.filter(
      (project) => project.status === "cancelld",
    ).length;

    return {
      total: totalProjects,
      completed: completedProjects,
      overdue: overdueProjects,
      pending: pendingProjects,
      cancelled: cancelledProjects,
      completionRate: totalProjects
        ? Math.round((completedProjects / totalProjects) * 100)
        : 0,
    };
  }, [projectRows]);

  const updateProjectStatus = async (projectId, newStatus) => {
    setUpdatingProjectId(projectId);

    try {
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(getApiError(payload));
      }

      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project._id === projectId || project.id === projectId
            ? { ...project, status: newStatus }
            : project,
        ),
      );

      success(`Project status updated to ${getStatusLabel(newStatus)}`);
    } catch (error) {
      console.error("Error updating project status:", error);
      failed(error.message || "Failed to update project status");
    } finally {
      setUpdatingProjectId(null);
    }
  };

  const deleteProject = async (projectId) => {
    const project = projects.find(
      (p) => p._id === projectId || p.id === projectId,
    );

    if (
      !window.confirm(
        `Are you sure you want to delete "${project?.title || "this project"}"?`,
      )
    ) {
      return;
    }

    setDeletingProjectId(projectId);

    try {
      const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const payload = await response.json();
        throw new Error(getApiError(payload));
      }

      setProjects((prevProjects) =>
        prevProjects.filter(
          (project) => project._id !== projectId && project.id !== projectId,
        ),
      );

      success("Project deleted successfully");
    } catch (error) {
      console.error("Error deleting project:", error);
      failed(error.message || "Failed to delete project");
    } finally {
      setDeletingProjectId(null);
    }
  };

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProjects.length / PAGE_SIZE),
  );
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pageProjects = filteredProjects.slice(pageStart, pageStart + PAGE_SIZE);

  const pageProjectIds = pageProjects.map((project) => project.id);
  const areAllPageProjectsSelected =
    pageProjectIds.length > 0 &&
    pageProjectIds.every((projectId) => selectedProjectIds.includes(projectId));

  const toggleProjectSelection = (projectId) => {
    setSelectedProjectIds((currentIds) =>
      currentIds.includes(projectId)
        ? currentIds.filter((id) => id !== projectId)
        : [...currentIds, projectId],
    );
  };

  const togglePageSelection = () => {
    setSelectedProjectIds((currentIds) => {
      if (areAllPageProjectsSelected) {
        return currentIds.filter((id) => !pageProjectIds.includes(id));
      }
      return [...new Set([...currentIds, ...pageProjectIds])];
    });
  };

  const moveToPage = (nextPage) => {
    setCurrentPage(Math.min(Math.max(nextPage, 1), totalPages));
  };

  const handleStatusChange = (projectId, currentStatus) => {
    const currentIndex = STATUS_OPTIONS.indexOf(currentStatus);
    const nextIndex = (currentIndex + 1) % STATUS_OPTIONS.length;
    const newStatus = STATUS_OPTIONS[nextIndex];
    updateProjectStatus(projectId, newStatus);
  };

  return (
    <section className="projects-page">
      <div className="container">
        <div className="projects-page__header">
          <div>
            <p className="projects-page__eyebrow">Workspace</p>
            <h1>Projects</h1>
            <p>Manage and track your ongoing projects.</p>
          </div>

          <button
            type="button"
            className="project-button project-button--primary"
            onClick={() => navigate("/layout/projects/add-new-project")}
          >
            <FiPlus />
            New Project
          </button>
        </div>

        <div className="projects-toolbar">
          <div className="projects-toolbar__filters">
            <div className="projects-search">
              <FiSearch className="projects-search__icon" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="projects-search__input"
              />
            </div>

            <label className="project-select">
              <span>Filter by status</span>
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="overdue">Overdue</option>
                <option value="cancelld">Cancelled</option>
              </select>
              <FiChevronDown />
            </label>

            <label className="project-sort">
              <span>Sort by:</span>
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="title">Project Title</option>
                <option value="client">Client Name</option>
              </select>
            </label>
          </div>
        </div>

        {loadError && (
          <div className="projects-message projects-message--error">
            {loadError}
          </div>
        )}

        <div className="projects-summary-grid">
          <article className="project-summary-card">
            <div className="project-summary-card__icon project-summary-card__icon--primary">
              <FiBriefcase />
            </div>
            <div>
              <p>Total Projects</p>
              <strong>{statistics.total}</strong>
              <span>All projects</span>
            </div>
          </article>

          <article className="project-summary-card">
            <div className="project-summary-card__icon project-summary-card__icon--success">
              <FiCheckCircle />
            </div>
            <div>
              <p>Completed</p>
              <strong>{statistics.completed}</strong>
              <span>{statistics.completionRate}% completion rate</span>
            </div>
          </article>

          <article className="project-summary-card">
            <div className="project-summary-card__icon project-summary-card__icon--warning">
              <FiClock />
            </div>
            <div>
              <p>Pending</p>
              <strong>{statistics.pending}</strong>
              <span>Awaiting action</span>
            </div>
          </article>

          <article className="project-summary-card">
            <div className="project-summary-card__icon project-summary-card__icon--danger">
              <FiClock />
            </div>
            <div>
              <p>Overdue</p>
              <strong>{statistics.overdue}</strong>
              <span>Need immediate attention</span>
            </div>
          </article>

          <article className="project-summary-card">
            <div className="project-summary-card__icon project-summary-card__icon--secondary">
              <FiCheckCircle />
            </div>
            <div>
              <p>Cancelled</p>
              <strong>{statistics.cancelled}</strong>
              <span>Cancelled projects</span>
            </div>
          </article>
        </div>

        <div className="projects-table-card">
          <div className="projects-table-scroll">
            <table>
              <thead>
                <tr>
                  <th className="projects-table__checkbox">
                    <input
                      type="checkbox"
                      checked={areAllPageProjectsSelected}
                      onChange={togglePageSelection}
                      aria-label="Select all visible projects"
                    />
                  </th>
                  <th>Project Title</th>
                  <th>Client</th>
                  <th>Description</th>
                  <th>Deadline</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="7" className="projects-table__state">
                      Loading your projects...
                    </td>
                  </tr>
                ) : pageProjects.length ? (
                  pageProjects.map((project) => (
                    <tr key={project.id}>
                      <td className="projects-table__checkbox">
                        <input
                          type="checkbox"
                          checked={selectedProjectIds.includes(project.id)}
                          onChange={() => toggleProjectSelection(project.id)}
                          aria-label={`Select ${project.title}`}
                        />
                      </td>

                      <td>
                        <div className="project-title-cell">
                          <span
                            className={`project-title-cell__marker project-title-cell__marker--${project.status}`}
                          />
                          <strong>{project.title}</strong>
                        </div>
                      </td>

                      <td>
                        <div className="project-client">
                          <span>{getInitials(project.clientName)}</span>
                          <p>{project.clientName}</p>
                        </div>
                      </td>

                      <td>
                        <small className="project-description">
                          {project.description || "No description"}
                        </small>
                      </td>

                      <td>
                        <span className="project-date">
                          <FiCalendar />
                          {formatDate(project.deadline)}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`project-status project-status--${project.status}`}
                          style={{ cursor: "pointer" }}
                          onClick={() =>
                            handleStatusChange(project.id, project.status)
                          }
                          title="Click to change status"
                        >
                          {updatingProjectId === project.id
                            ? "Updating..."
                            : getStatusLabel(project.status)}
                        </span>
                      </td>

                      <td>
                        <div className="project-actions">
                          <button
                            type="button"
                            className="project-action-button project-action-button--edit"
                            onClick={() => {
                              navigate(`/layout/projects/edit/${project.id}`);
                            }}
                            title="Edit project"
                          >
                            <FiEdit />
                          </button>
                          <button
                            type="button"
                            className="project-action-button project-action-button--delete"
                            onClick={() => deleteProject(project.id)}
                            disabled={deletingProjectId === project.id}
                            title="Delete project"
                          >
                            {deletingProjectId === project.id ? (
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
                    <td colSpan="7" className="projects-table__state">
                      No projects match the selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {!isLoading && filteredProjects.length > 0 && (
            <div className="projects-pagination">
              <p>
                Showing {pageStart + 1}–
                {Math.min(pageStart + PAGE_SIZE, filteredProjects.length)} of{" "}
                {filteredProjects.length} projects
              </p>

              <div>
                <button
                  type="button"
                  onClick={() => moveToPage(currentPage - 1)}
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
                  onClick={() => moveToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  aria-label="Next page"
                >
                  <FiChevronRight />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Projects;
