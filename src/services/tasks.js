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
// MOSTRAR TAREAS + MÉTRICAS
// =======================
function loadTasks() {
  fetch(`${API_URL}/tasks?userId=${session.id}`)
    .then(res => res.json())
    .then(tasks => {

      // MÉTRICAS
      totalTasks.textContent = tasks.length;
      pendingTasks.textContent =
        tasks.filter(task => task.status === "pending").length;
      completedTasks.textContent =
        tasks.filter(task => task.status === "completed").length;

      taskList.innerHTML = "";

      if (tasks.length === 0) {
        taskList.innerHTML =
          "<tr><td colspan='4'>No tasks yet</td></tr>";
        return;
      }

      tasks.forEach(task => {
        const tr = document.createElement("tr");

        const statusBtnText =
          task.status === "completed"
            ? "Mark Pending"
            : "Mark Completed";

        tr.innerHTML = `
          <td>${task.title}</td>
          <td>${task.status}</td>
          <td>${task.priority}</td>
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
    });
}

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
      userId: session.id
    };

    fetch(`${API_URL}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask)
    }).then(loadTasks);
  });
}

// =======================
// CAMBIAR ESTADO
// =======================
function toggleStatus(id, currentStatus, title) {
  const newStatus =
    currentStatus === "completed" ? "pending" : "completed";

  fetch(`${API_URL}/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title,
      status: newStatus,
      priority: "medium",
      userId: session.id
    })
  }).then(loadTasks);
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
      userId: session.id
    })
  }).then(loadTasks);
}

// =======================
// ELIMINAR TAREA
// =======================
function deleteTask(id) {
  if (!confirm("Are you sure you want to delete this task?")) return;

  fetch(`${API_URL}/tasks/${id}`, {
    method: "DELETE"
  }).then(loadTasks);
}

// =======================
// HACER FUNCIONES GLOBALES (FIX)
// =======================
window.toggleStatus = toggleStatus;
window.editTask = editTask;
window.deleteTask = deleteTask;

// =======================
// INICIAR
// =======================
loadTasks();
