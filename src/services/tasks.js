// =======================
// CONFIGURACIÓN
// =======================
const API_URL = "http://localhost:3001";
const session = JSON.parse(localStorage.getItem("session"));

const taskList = document.getElementById("taskList");
const newTaskBtn = document.getElementById("newTaskBtn");

// MÉTRICAS
const totalTasks = document.getElementById("totalTasks");
const pendingTasks = document.getElementById("pendingTasks");
const completedTasks = document.getElementById("completedTasks");

// Si no hay sesión → login
if (!session) {
  window.location.href = "../../public/views/login.html";
}

// =======================
// RENDERIZAR TAREAS
// =======================
function formatDate(dateString) {
  if (!dateString) return "—";

  const date = new Date(dateString);
  if (isNaN(date)) return "—";

  const options = { year: "numeric", month: "short", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

function renderTasks(tasks) {
  taskList.innerHTML = "";

  if (tasks.length === 0) {
    taskList.innerHTML = "<tr><td colspan='4'>No tasks found</td></tr>";
    return;
  }

  tasks.forEach((task) => {
    const tr = document.createElement("tr");

    const statusBtnText =
      task.status === "completed" ? "Mark Pending" : "Mark Completed";

    tr.innerHTML = `
      <td>${task.title}</td>
      <td><span class="status ${task.status}">${task.status}</span></td>
      <td>${task.category || "—"}</td>
      <td><span class="priority ${task.priority}">${task.priority}</span></td>
      <td>${formatDate(task.dueDate)}</td>
      <td>
        <button onclick="toggleStatus('${task.id}', '${task.status}', '${task.title}')">
          ${statusBtnText}
        </button>
        <button onclick="editTask('${task.id}', '${task.title}', '${task.status}', '${task.priority}')">
          Edit
        </button>
        <button onclick="deleteTask('${task.id}')">
          Delete
        </button>
      </td>
    `;

    taskList.appendChild(tr);
  });
}

// =======================
// CARGAR TAREAS + MÉTRICAS
// =======================
function loadTasks() {
  fetch(`${API_URL}/tasks?userId=${session.id}`)
    .then((res) => res.json())
    .then((tasks) => {
      // MÉTRICAS
      totalTasks.textContent = tasks.length;
      pendingTasks.textContent = tasks.filter(
        (task) => task.status === "pending",
      ).length;
      completedTasks.textContent = tasks.filter(
        (task) => task.status === "completed",
      ).length;

      // Mostrar todas las tareas por defecto
      renderTasks(tasks);
    });
}

// =======================
// FILTROS
// =======================
const filterButtons = document.querySelectorAll(".filter-btn");

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    // Cambiar estado visual
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const filter = btn.dataset.filter;

    fetch(`${API_URL}/tasks?userId=${session.id}`)
      .then((res) => res.json())
      .then((tasks) => {
        let filtered = tasks;

        if (filter === "pending") {
          filtered = tasks.filter((t) => t.status === "pending");
        } else if (filter === "completed") {
          filtered = tasks.filter((t) => t.status === "completed");
        }

        renderTasks(filtered);
      });
  });
});

// =======================
// CREAR TAREA
// =======================
if (newTaskBtn) {
  newTaskBtn.addEventListener("click", () => {
    const title = prompt("Task title:");
    if (!title) return;

    const newTask = {
      title,
      status: "pending",
      priority: "medium",
      userId: session.id,
    };

    fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask),
    }).then(loadTasks);
  });
}

// =======================
// CAMBIAR ESTADO
// =======================
function toggleStatus(id, currentStatus) {
  const newStatus = currentStatus === "completed" ? "pending" : "completed";

  // 1. Obtener la tarea completa
  fetch(`${API_URL}/tasks/${id}`)
    .then(res => res.json())
    .then(task => {

      // 2. Actualizar solo el estado
      const updatedTask = {
        ...task,
        status: newStatus
      };

      // 3. Guardar sin perder campos
      fetch(`${API_URL}/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTask)
      }).then(loadTasks);
    });
}


// =======================
// EDITAR TAREA
// =======================
function editTask(id, currentTitle, currentStatus, currentPriority) {
  const newTitle = prompt("Edit task title:", currentTitle);
  if (!newTitle) return;

  fetch(`${API_URL}/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: newTitle,
      status: currentStatus,
      priority: currentPriority,
      userId: session.id,
    }),
  }).then(loadTasks);
}

// =======================
// ELIMINAR TAREA
// =======================
function deleteTask(id) {
  if (!confirm("Are you sure you want to delete this task?")) return;

  fetch(`${API_URL}/tasks/${id}`, {
    method: "DELETE",
  }).then(loadTasks);
}

// =======================
// HACER FUNCIONES GLOBALES
// =======================
window.toggleStatus = toggleStatus;
window.editTask = editTask;
window.deleteTask = deleteTask;

// =======================
// INICIAR
// =======================
loadTasks();
