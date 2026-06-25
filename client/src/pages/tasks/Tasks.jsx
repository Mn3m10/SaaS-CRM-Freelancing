/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FiPlus,
  FiChevronLeft,
  FiChevronRight,
  FiCalendar,
  FiBriefcase,
  FiCheckCircle,
  FiClock,
  FiAlertCircle,
  FiEdit,
  FiTrash2,
  FiChevronDown,
  FiSearch,
} from "react-icons/fi";
import "./Tasks.css";
import { success, failed } from "../../assets/utils/Toasts";

const API_BASE_URL = "http://localhost:5000/api/v1";

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

const getStatusLabel = (status) => {
  const labels = {
    pending: "Pending",
    completed: "Completed",
    overdue: "Overdue",
    cancelld: "Cancelled",
  };
  return labels[status] || status;
};

const formatDate = (dateValue) => {
  if (!dateValue) return "No deadline";
  const date = new Date(dateValue);
  if (isNaN(date.getTime())) return "No deadline";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

const STATUS_OPTIONS = ["pending", "completed", "overdue", "cancelld"];

const Tasks = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [limit, setLimit] = useState(5);

  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedTaskIds, setSelectedTaskIds] = useState([]);
  const [deletingTaskId, setDeletingTaskId] = useState(null);
  const [updatingTaskId, setUpdatingTaskId] = useState(null);

  const loadTasks = async (page = 1, status = "all", sort = "newest", search = "") => {
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

      if (sort === "newest") {
        params.append("sort", "-createdAt");
      } else if (sort === "oldest") {
        params.append("sort", "createdAt");
      } else if (sort === "deadline") {
        params.append("sort", "deadline");
      } else if (sort === "title") {
        params.append("sort", "title");
      }

      const response = await fetch(
        `${API_BASE_URL}/tasks?${params.toString()}`,
        {
          headers: getAuthHeaders(),
        },
      );

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(getApiError(payload));
      }

      const tasksData = Array.isArray(payload.data) ? payload.data : [];

      setTasks(tasksData);
      setTotalTasks(payload["total documents"] || tasksData.length);

      if (payload.paginationResult) {
        setCurrentPage(payload.paginationResult.currentPage || 1);
        setTotalPages(payload.paginationResult.pageCount || 1);
        setLimit(payload.paginationResult.limit || 5);
      } else {
        setTotalPages(Math.ceil(tasksData.length / limit));
      }
    } catch (error) {
      setError(error.message || "Unable to load tasks.");
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTasks(1, statusFilter, sortBy, searchQuery);
  }, []);

  useEffect(() => {
    if (location.state?.refresh) {
      loadTasks(currentPage, statusFilter, sortBy, searchQuery);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    loadTasks(1, statusFilter, sortBy, searchQuery);
    setCurrentPage(1);
  }, [statusFilter, sortBy]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage === 1) {
        loadTasks(1, statusFilter, sortBy, searchQuery);
      } else {
        setCurrentPage(1);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      loadTasks(newPage, statusFilter, sortBy, searchQuery);
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    setUpdatingTaskId(taskId);

    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ status: newStatus }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(getApiError(payload));
      }

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId || task.id === taskId
            ? { ...task, status: newStatus }
            : task
        )
      );

      success(`Task status updated to ${getStatusLabel(newStatus)}`);
    } catch (error) {
      console.error("Error updating task status:", error);
      failed(error.message || "Failed to update task status");
    } finally {
      setUpdatingTaskId(null);
    }
  };

  const deleteTask = async (taskId) => {
    const task = tasks.find((t) => t._id === taskId || t.id === taskId);

    if (
      !window.confirm(
        `Are you sure you want to delete "${task?.title || "this task"}"?`,
      )
    ) {
      return;
    }

    setDeletingTaskId(taskId);

    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        const payload = await response.json();
        throw new Error(getApiError(payload));
      }

      setTasks((prevTasks) =>
        prevTasks.filter((task) => task._id !== taskId && task.id !== taskId),
      );

      success("Task deleted successfully");
      loadTasks(currentPage, statusFilter, sortBy, searchQuery);
    } catch (error) {
      console.error("Error deleting task:", error);
      failed(error.message || "Failed to delete task");
    } finally {
      setDeletingTaskId(null);
    }
  };

  const handleStatusChange = (taskId, currentStatus) => {
    const currentIndex = STATUS_OPTIONS.indexOf(currentStatus);
    const nextIndex = (currentIndex + 1) % STATUS_OPTIONS.length;
    const newStatus = STATUS_OPTIONS[nextIndex];
    updateTaskStatus(taskId, newStatus);
  };

  const pageTasks = tasks;
  const pageStart = (currentPage - 1) * limit;

  const pageTaskIds = pageTasks.map((task) => task._id || task.id);

  const areAllPageTasksSelected =
    pageTaskIds.length > 0 &&
    pageTaskIds.every((taskId) => selectedTaskIds.includes(taskId));

  const toggleTaskSelection = (taskId) => {
    setSelectedTaskIds((currentIds) =>
      currentIds.includes(taskId)
        ? currentIds.filter((id) => id !== taskId)
        : [...currentIds, taskId],
    );
  };

  const togglePageSelection = () => {
    setSelectedTaskIds((currentIds) => {
      if (areAllPageTasksSelected) {
        return currentIds.filter((id) => !pageTaskIds.includes(id));
      }

      return [...new Set([...currentIds, ...pageTaskIds])];
    });
  };

  const statistics = {
    total: totalTasks,
    completed: tasks.filter((t) => t.status === "completed").length,
    pending: tasks.filter((t) => t.status === "pending").length,
    overdue: tasks.filter((t) => t.status === "overdue").length,
    cancelled: tasks.filter((t) => t.status === "cancelld").length,
  };

  return (
    <section className="tasks-page">
      <div className="container">
        <div className="tasks-page__header">
          <div>
            <p className="tasks-page__eyebrow">Workspace</p>
            <h1>Tasks</h1>
            <p>Manage your project tasks and track progress.</p>
          </div>

          <button
            type="button"
            className="task-button task-button--primary"
            onClick={() => navigate("/layout/tasks/add-new-task")}
          >
            <FiPlus />
            New Task
          </button>
        </div>

        <div className="tasks-summary-grid">
          <article className="task-summary-card">
            <div className="task-summary-card__icon task-summary-card__icon--primary">
              <FiBriefcase />
            </div>
            <div>
              <p>Total Tasks</p>
              <strong>{statistics.total}</strong>
              <span>All tasks</span>
            </div>
          </article>

          <article className="task-summary-card">
            <div className="task-summary-card__icon task-summary-card__icon--success">
              <FiCheckCircle />
            </div>
            <div>
              <p>Completed</p>
              <strong>{statistics.completed}</strong>
              <span>Done</span>
            </div>
          </article>

          <article className="task-summary-card">
            <div className="task-summary-card__icon task-summary-card__icon--warning">
              <FiClock />
            </div>
            <div>
              <p>Pending</p>
              <strong>{statistics.pending}</strong>
              <span>In progress</span>
            </div>
          </article>

          <article className="task-summary-card">
            <div className="task-summary-card__icon task-summary-card__icon--danger">
              <FiAlertCircle />
            </div>
            <div>
              <p>Overdue</p>
              <strong>{statistics.overdue}</strong>
              <span>Need attention</span>
            </div>
          </article>

          <article className="task-summary-card">
            <div className="task-summary-card__icon task-summary-card__icon--secondary">
              <FiCheckCircle />
            </div>
            <div>
              <p>Cancelled</p>
              <strong>{statistics.cancelled}</strong>
              <span>Cancelled tasks</span>
            </div>
          </article>
        </div>

        <div className="tasks-toolbar">
          <div className="tasks-toolbar__filters">
            <div className="tasks-search">
              <FiSearch className="tasks-search__icon" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="tasks-search__input"
              />
            </div>

            <label className="task-select">
              <span>Filter by status</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="overdue">Overdue</option>
                <option value="cancelld">Cancelled</option>
              </select>
              <FiChevronDown />
            </label>

            <label className="task-sort">
              <span>Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="deadline">Deadline</option>
                <option value="title">Title</option>
              </select>
            </label>
          </div>
        </div>

        {error && (
          <div className="tasks-message tasks-message--error">{error}</div>
        )}

        {isLoading ? (
          <div className="tasks-loading">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="tasks-empty">
            <p>No tasks found. Create your first task!</p>
          </div>
        ) : (
          <div className="tasks-table-card">
            <div className="tasks-table-scroll">
              <table>
                <thead>
                  <tr>
                    <th className="tasks-table__checkbox">
                      <input
                        type="checkbox"
                        checked={areAllPageTasksSelected}
                        onChange={togglePageSelection}
                        aria-label="Select all visible tasks"
                      />
                    </th>
                    <th>Task Title</th>
                    <th>Project</th>
                    <th>Deadline</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pageTasks.map((task) => (
                    <tr key={task._id || task.id}>
                      <td className="tasks-table__checkbox">
                        <input
                          type="checkbox"
                          checked={selectedTaskIds.includes(
                            task._id || task.id,
                          )}
                          onChange={() =>
                            toggleTaskSelection(task._id || task.id)
                          }
                          aria-label={`Select ${task.title}`}
                        />
                      </td>
                      <td>
                        <div className="task-title-cell">
                          <span
                            className={`task-title-cell__marker task-title-cell__marker--${task.status}`}
                          />
                          <strong>{task.title}</strong>
                        </div>
                      </td>
                      <td>
                        <span className="task-project-name">
                          {typeof task.project === "object"
                            ? task.project.title || "No project"
                            : task.project || "No project"}
                        </span>
                      </td>
                      <td>
                        <span className="task-date">
                          <FiCalendar />
                          {formatDate(task.deadline)}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`task-status task-status--${task.status}`}
                          style={{ cursor: "pointer" }}
                          onClick={() => handleStatusChange(task._id || task.id, task.status)}
                          title="Click to change status"
                        >
                          {updatingTaskId === (task._id || task.id) ? "Updating..." : getStatusLabel(task.status)}
                        </span>
                      </td>
                      <td>
                        <div className="task-actions">
                          <button
                            type="button"
                            className="task-action-button task-action-button--edit"
                            onClick={() => {
                              navigate(
                                `/layout/tasks/edit/${task._id || task.id}`,
                              );
                            }}
                            title="Edit task"
                          >
                            <FiEdit />
                          </button>
                          <button
                            type="button"
                            className="task-action-button task-action-button--delete"
                            onClick={() => deleteTask(task._id || task.id)}
                            disabled={deletingTaskId === (task._id || task.id)}
                            title="Delete task"
                          >
                            {deletingTaskId === (task._id || task.id) ? (
                              "..."
                            ) : (
                              <FiTrash2 />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {!isLoading && totalTasks > 0 && (
              <div className="tasks-pagination">
                <p>
                  Showing {pageStart + 1}–
                  {Math.min(pageStart + limit, totalTasks)} of {totalTasks}{" "}
                  tasks
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
        )}
      </div>
    </section>
  );
};

export default Tasks;