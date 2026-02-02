// =======================
// CONFIGURATION
// =======================
const API_URL = "http://localhost:3001";
const session = JSON.parse(localStorage.getItem("session"));

// DOM ELEMENTS
const totalTasksElem = document.getElementById("totalTasks");
const pendingTasksElem = document.getElementById("pendingTasks");
const completedTasksElem = document.getElementById("completedTasks");
const progressPercentElem = document.getElementById("progressPercent"); // New element added
const adminTaskList = document.getElementById("adminTaskList");

// ROLE-BASED PROTECTION
if (!session || session.role !== "admin") {
  window.location.href = "../../public/views/login.html";
}

// =======================
// LOAD ADMIN DATA
// =======================
function loadAdminData() {
  fetch(`${API_URL}/tasks`)
    .then((res) => res.json())
    .then((tasks) => {
      const total = tasks.length;
      const pending = tasks.filter((t) => t.status === "pending").length;
      const completed = tasks.filter((t) => t.status === "completed").length;

      // ===== METRICS CALCULATION =====
      totalTasksElem.textContent = total;
      pendingTasksElem.textContent = pending;
      completedTasksElem.textContent = completed;

      // ===== PROGRESS CALCULATION =====
      // Avoid division by zero if there are no tasks
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
      if (progressPercentElem) {
        progressPercentElem.textContent = `${percentage}%`;
      }

      // ===== TABLE RENDERING =====
      adminTaskList.innerHTML = "";

      if (total === 0) {
        adminTaskList.innerHTML =
          "<tr><td colspan='5'>No tasks found in the system</td></tr>";
        return;
      }

      tasks.forEach((task) => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
          <td><strong>${task.title}</strong></td>
          <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${task.description || "No description"}">
            ${task.description || '<span style="color: #ccc;">No description</span>'}
          </td>
          <td>${task.userId}</td>
          <td>
            <span class="status ${task.status}">${task.status}</span>
          </td>
          <td>
            <span class="priority ${task.priority || "medium"}">${task.priority || "medium"}</span>
          </td>
          <td>
            <button class="delete-btn" onclick="deleteTask('${task.id}')" title="Delete Task">
              🗑️ Delete
            </button>
          </td>
        `;

        adminTaskList.appendChild(tr);
      });
    })
    .catch((err) => console.error("Error loading admin data:", err));
}

// =======================
// DELETE TASK
// =======================
function deleteTask(id) {
  if (
    !confirm(
      "Are you sure you want to delete this task? This action cannot be undone.",
    )
  )
    return;

  fetch(`${API_URL}/tasks/${id}`, {
    method: "DELETE",
  })
    .then((res) => {
      if (res.ok) loadAdminData();
      else alert("Error deleting task");
    })
    .catch((err) => alert("Server error while deleting task"));
}

// =======================
// EXPOSE GLOBAL FUNCTIONS
// =======================
window.deleteTask = deleteTask;

// =======================
// INITIALIZE
// =======================
loadAdminData();
