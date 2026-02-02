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
      pendingTasks.textContent = tasks.filter(t => t.status === "pending").length;
      completedTasks.textContent = tasks.filter(t => t.status === "completed").length;

      // ===== TABLA =====
      adminTaskList.innerHTML = "";

      if (tasks.length === 0) {
        adminTaskList.innerHTML = "<tr><td colspan='5'>No tasks found in the system</td></tr>";
        return;
      }

      tasks.forEach(task => {
        const tr = document.createElement("tr");

        // Solo lectura: Usamos las mismas clases CSS que en la vista de usuario
        tr.innerHTML = `
          <td><strong>${task.title}</strong></td>
          <td>${task.userId}</td>
          <td>
            <span class="status ${task.status}">${task.status}</span>
          </td>
          <td>
            <span class="priority ${task.priority || 'medium'}">${task.priority || 'medium'}</span>
          </td>
          <td>
            <button class="delete-btn" onclick="deleteTask('${task.id}')" title="Eliminar tarea">
              🗑️ Delete
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
  if (!confirm("Are you sure you want to delete this task? This action cannot be undone.")) return;

  fetch(`${API_URL}/tasks/${id}`, {
    method: "DELETE"
  })
  .then(res => {
    if (res.ok) loadAdminData();
    else alert("Error deleting task");
  });
}

// =======================
// HACER FUNCIÓN GLOBAL
// =======================
window.deleteTask = deleteTask;

// =======================
// INICIAR
// =======================
loadAdminData();
