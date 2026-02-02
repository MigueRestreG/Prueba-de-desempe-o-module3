// =======================
// CONFIGURACIÓN
// =======================
const API_URL = "http://localhost:3001";
const session = JSON.parse(localStorage.getItem("session"));

// ELEMENTOS
const totalTasks = document.getElementById("totalTasks");
const pendingTasks = document.getElementById("pendingTasks");
const completedTasks = document.getElementById("completedTasks");
const adminTaskList = document.getElementById("adminTaskList");

// PROTECCIÓN POR ROL
if (!session || session.role !== "admin") {
  window.location.href = "../../public/views/login.html";
}

// =======================
// CARGAR DATOS ADMIN
// =======================
function loadAdminData() {
  fetch(`${API_URL}/tasks`)
    .then(res => res.json())
    .then(tasks => {

      // ===== MÉTRICAS =====
      totalTasks.textContent = tasks.length;
      pendingTasks.textContent =
        tasks.filter(task => task.status === "pending").length;
      completedTasks.textContent =
        tasks.filter(task => task.status === "completed").length;

      // ===== TABLA =====
      adminTaskList.innerHTML = "";

      if (tasks.length === 0) {
        adminTaskList.innerHTML =
          "<tr><td colspan='4'>No tasks found</td></tr>";
        return;
      }

      tasks.forEach(task => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
          <td>${task.title}</td>
          <td>${task.userId}</td>
          <td>${task.status}</td>
          <td>
            <button onclick="deleteTask('${task.id}')">
              Delete
            </button>
          </td>
        `;

        adminTaskList.appendChild(tr);
      });
    });
}

// =======================
// ELIMINAR TAREA
// =======================
function deleteTask(id) {
  if (!confirm("Delete this task?")) return;

  fetch(`${API_URL}/tasks/${id}`, {
    method: "DELETE"
  }).then(loadAdminData);
}

// =======================
// HACER FUNCIÓN GLOBAL (FIX)
// =======================
window.deleteTask = deleteTask;

// =======================
// INICIAR
// =======================
loadAdminData();
