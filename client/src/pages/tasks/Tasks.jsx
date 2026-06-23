import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiCalendar,
  FiCheckCircle,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiGrid,
  FiList,
  FiPlus,
} from "react-icons/fi";
import "./Tasks.css";

const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api/v1"
).replace(/\/$/, "");

const getAuthHeaders = () => {
  const token =
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("authToken") ||
    sessionStorage.getItem("token") ||
    "";

  const headers = {};

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

const priorityOrder = {
  high: 0,
  medium: 1,
  low: 2,
};

const formatDate = (dateValue) => {
  if (!dateValue) {
    return "No deadline";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "No deadline";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

const getInitials = (name) => {
  if (!name) {
    return "ME";
  }

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
};

const getAssigneeName = (user) => {
  if (!user || typeof user !== "object") {
    return "Me";
  }

  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();

  return user.name || fullName || user.username || "Me";
};

const getTaskStatus = (task) => {
  const currentStatus = String(task.status || "pending").toLowerCase();

  if (currentStatus === "completed") {
    return "completed";
  }

  if (currentStatus === "cancelld" || currentStatus === "cancelled") {
    return "cancelled";
  }

  const deadline = task.deadline ? new Date(task.deadline) : null;
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  if (deadline && !Number.isNaN(deadline.getTime()) && deadline < today) {
    return "overdue";
  }

  return currentStatus === "overdue" ? "overdue" : "pending";
};

const isDueThisWeek = (deadline, status) => {
  if (!deadline || status === "completed" || status === "cancelled") {
    return false;
  }

  const date = new Date(deadline);
  const today = new Date();
  const nextWeek = new Date();

  today.setHours(0, 0, 0, 0);
  nextWeek.setHours(23, 59, 59, 999);
  nextWeek.setDate(nextWeek.getDate() + 7);

  return !Number.isNaN(date.getTime()) && date >= today && date <= nextWeek;
};

const Tasks = () => {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("dueDate");
  const [viewMode, setViewMode] = useState("list");

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTaskIds, setSelectedTaskIds] = useState([]);

  const loadData = async () => {
    setIsLoading(true);
    setLoadError("");

    try {
      const [tasksResponse, projectsResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/tasks?limit=100`, {
          headers: getAuthHeaders(),
        }),
        fetch(`${API_BASE_URL}/projects?limit=100`, {
          headers: getAuthHeaders(),
        }),
      ]);

      const [tasksPayload, projectsPayload] = await Promise.all([
        tasksResponse.json(),
        projectsResponse.json(),
      ]);

      if (!tasksResponse.ok) {
        throw new Error(getApiError(tasksPayload));
      }

      if (!projectsResponse.ok) {
        throw new Error(getApiError(projectsPayload));
      }

      setTasks(Array.isArray(tasksPayload.data) ? tasksPayload.data : []);
      setProjects(
        Array.isArray(projectsPayload.data) ? projectsPayload.data : []
      );
    } catch (error) {
      setLoadError(error.message || "Unable to load tasks right now.");
      setTasks([]);
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, priorityFilter, sortBy]);

  const taskRows = useMemo(() => {
    const projectById = new Map(
      projects.map((project) => [project._id || project.id, project])
    );

    return tasks.map((task) => {
      const projectId =
        typeof task.project === "object"
          ? task.project?._id || task.project?.id
          : task.project;

      const relatedProject = projectById.get(projectId);

      const projectName =
        task.project?.title ||
        task.project?.name ||
        relatedProject?.title ||
        relatedProject?.name ||
        "No project";

      return {
        id: task._id || task.id,
        title: task.title || "Untitled task",
        description: task.description || "",
        deadline: task.deadline || "",
        priority: String(task.priority || "medium").toLowerCase(),
        status: getTaskStatus(task),
        projectName,
        assignee: getAssigneeName(task.user),
      };
    });
  }, [tasks, projects]);

  const filteredTasks = useMemo(() => {
    const rows = taskRows.filter((task) => {
      const statusMatches =
        statusFilter === "all" || task.status === statusFilter;

      const priorityMatches =
        priorityFilter === "all" || task.priority === priorityFilter;

      return statusMatches && priorityMatches;
    });

    return [...rows].sort((firstTask, secondTask) => {
      if (sortBy === "title") {
        return firstTask.title.localeCompare(secondTask.title);
      }

      if (sortBy === "priority") {
        return (
          (priorityOrder[firstTask.priority] ?? 3) -
          (priorityOrder[secondTask.priority] ?? 3)
        );
      }

      if (sortBy === "newest") {
        return String(secondTask.id).localeCompare(String(firstTask.id));
      }

      const firstDeadline = firstTask.deadline
        ? new Date(firstTask.deadline).getTime()
        : Number.MAX_SAFE_INTEGER;

      const secondDeadline = secondTask.deadline
        ? new Date(secondTask.deadline).getTime()
        : Number.MAX_SAFE_INTEGER;

      return firstDeadline - secondDeadline;
    });
  }, [taskRows, statusFilter, priorityFilter, sortBy]);

  const statistics = useMemo(() => {
    const completedTasks = taskRows.filter(
      (task) => task.status === "completed"
    ).length;

    const overdueTasks = taskRows.filter(
      (task) => task.status === "overdue"
    ).length;

    const dueThisWeek = taskRows.filter((task) =>
      isDueThisWeek(task.deadline, task.status)
    ).length;

    return {
      completionRate: taskRows.length
        ? Math.round((completedTasks / taskRows.length) * 100)
        : 0,
      overdueTasks,
      dueThisWeek,
    };
  }, [taskRows]);

  const totalPages = Math.max(1, Math.ceil(filteredTasks.length / PAGE_SIZE));
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pageTasks = filteredTasks.slice(pageStart, pageStart + PAGE_SIZE);

  const pageTaskIds = pageTasks.map((task) => task.id);

  const areAllPageTasksSelected =
    pageTaskIds.length > 0 &&
    pageTaskIds.every((taskId) => selectedTaskIds.includes(taskId));

  const toggleTaskSelection = (taskId) => {
    setSelectedTaskIds((currentIds) =>
      currentIds.includes(taskId)
        ? currentIds.filter((id) => id !== taskId)
        : [...currentIds, taskId]
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

  const moveToPage = (nextPage) => {
    setCurrentPage(Math.min(Math.max(nextPage, 1), totalPages));
  };

  return (
    <section className="tasks-page">
      <div className="tasks-page__header">
        <div>
          <p className="tasks-page__eyebrow">Workspace</p>
          <h1>Tasks</h1>
          <p>Manage and track your daily productivity.</p>
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

      <div className="tasks-toolbar">
        <div className="tasks-toolbar__filters">
          <label className="task-select">
            <span>Filter by status</span>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="overdue">Overdue</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <FiChevronDown />
          </label>

          <label className="task-select">
            <span>Filter by priority</span>

            <select
              value={priorityFilter}
              onChange={(event) => setPriorityFilter(event.target.value)}
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <FiChevronDown />
          </label>

          <label className="task-sort">
            <span>Sort by:</span>

            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
            >
              <option value="dueDate">Due Date</option>
              <option value="newest">Newest</option>
              <option value="priority">Priority</option>
              <option value="title">Task Title</option>
            </select>
          </label>
        </div>

        <div className="tasks-toolbar__view-toggle" aria-label="Task view">
          <button
            type="button"
            className={viewMode === "list" ? "is-active" : ""}
            onClick={() => setViewMode("list")}
            aria-label="List view"
            title="List view"
          >
            <FiList />
          </button>

          <button
            type="button"
            className={viewMode === "grid" ? "is-active" : ""}
            onClick={() => setViewMode("grid")}
            aria-label="Grid view"
            title="Grid view"
          >
            <FiGrid />
          </button>
        </div>
      </div>

      {loadError && (
        <div className="tasks-message tasks-message--error">{loadError}</div>
      )}

      {viewMode === "list" ? (
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
                  <th>Related Project</th>
                  <th>Assignee</th>
                  <th>Priority</th>
                  <th>Due Date</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="7" className="tasks-table__state">
                      Loading your tasks...
                    </td>
                  </tr>
                ) : pageTasks.length ? (
                  pageTasks.map((task) => (
                    <tr key={task.id}>
                      <td className="tasks-table__checkbox">
                        <input
                          type="checkbox"
                          checked={selectedTaskIds.includes(task.id)}
                          onChange={() => toggleTaskSelection(task.id)}
                          aria-label={`Select ${task.title}`}
                        />
                      </td>

                      <td>
                        <div className="task-title-cell">
                          <span
                            className={`task-title-cell__marker task-title-cell__marker--${task.status}`}
                          />

                          <div>
                            <strong>{task.title}</strong>
                            <small>
                              {task.description || "No description"}
                            </small>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="task-project-name">
                          {task.projectName}
                        </span>
                      </td>

                      <td>
                        <div className="task-assignee">
                          <span>{getInitials(task.assignee)}</span>
                          <p>{task.assignee}</p>
                        </div>
                      </td>

                      <td>
                        <span
                          className={`task-priority task-priority--${task.priority}`}
                        >
                          <i />
                          {task.priority}
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
                        >
                          {task.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="tasks-table__state">
                      No tasks match the selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {!isLoading && filteredTasks.length > 0 && (
            <div className="tasks-pagination">
              <p>
                Showing {pageStart + 1}–
                {Math.min(pageStart + PAGE_SIZE, filteredTasks.length)} of{" "}
                {filteredTasks.length} tasks
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
      ) : (
        <div className="task-grid">
          {isLoading ? (
            <div className="tasks-table-card tasks-grid__state">
              Loading your tasks...
            </div>
          ) : pageTasks.length ? (
            pageTasks.map((task) => (
              <article className="task-grid-card" key={task.id}>
                <div className="task-grid-card__top">
                  <span
                    className={`task-status task-status--${task.status}`}
                  >
                    {task.status}
                  </span>

                  <span
                    className={`task-priority task-priority--${task.priority}`}
                  >
                    <i />
                    {task.priority}
                  </span>
                </div>

                <h3>{task.title}</h3>
                <p>{task.description || "No description added yet."}</p>

                <div className="task-grid-card__meta">
                  <span>{task.projectName}</span>

                  <span>
                    <FiCalendar />
                    {formatDate(task.deadline)}
                  </span>
                </div>

                <div className="task-assignee">
                  <span>{getInitials(task.assignee)}</span>
                  <p>{task.assignee}</p>
                </div>
              </article>
            ))
          ) : (
            <div className="tasks-table-card tasks-grid__state">
              No tasks match the selected filters.
            </div>
          )}
        </div>
      )}

      <div className="tasks-summary-grid">
        <article className="task-summary-card">
          <div className="task-summary-card__icon task-summary-card__icon--success">
            <FiCheckCircle />
          </div>

          <div>
            <p>Completion Rate</p>
            <strong>{statistics.completionRate}%</strong>
            <span>Across all tasks</span>
          </div>
        </article>

        <article className="task-summary-card">
          <div className="task-summary-card__icon task-summary-card__icon--danger">
            <FiClock />
          </div>

          <div>
            <p>Overdue Tasks</p>
            <strong>{statistics.overdueTasks}</strong>
            <span>Need attention today</span>
          </div>
        </article>

        <article className="task-summary-card">
          <div className="task-summary-card__icon task-summary-card__icon--primary">
            <FiCalendar />
          </div>

          <div>
            <p>Due This Week</p>
            <strong>{statistics.dueThisWeek}</strong>
            <span>Next 7 days</span>
          </div>
        </article>
      </div>
    </section>
  );
};

export default Tasks;
