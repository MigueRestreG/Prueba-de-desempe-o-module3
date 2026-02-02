const session = JSON.parse(localStorage.getItem("session"));
const API_URL = "http://localhost:3001";

// Referencias del DOM
const fullNameDisplay = document.getElementById("fullName");
const profileNameMain = document.getElementById("profileNameMain");
const profileBadge = document.getElementById("profileBadge");
const roleLevel = document.getElementById("roleLevel"); // NUEVO: Referencia al Role Level
const taskCountDisplay = document.querySelector(".task-count strong");
const editBtn = document.querySelector(".edit-btn");

function initProfile() {
  if (!session) return;
  
  // Llenar datos de la sesión
  fullNameDisplay.textContent = session.name;
  profileNameMain.textContent = session.name;
  document.getElementById("profileEmail").textContent = session.email;
  
  // Mostrar el rol en el badge y en el campo de información personal
  profileBadge.textContent = session.role;
  if (roleLevel) {
    roleLevel.textContent = session.role; // Aquí se asigna el rol al Role Level
  }

  // Cargar contador real de tareas
  fetch(`${API_URL}/tasks?userId=${session.id}`)
    .then(res => res.json())
    .then(tasks => {
      taskCountDisplay.textContent = tasks.length;
    })
    .catch(err => console.error("Error cargando tareas:", err));
}

// Lógica de edición (mantener lo anterior)
editBtn.addEventListener("click", () => {
  if (editBtn.textContent.includes("Save")) {
    saveProfile();
  } else {
    const currentName = fullNameDisplay.textContent;
    fullNameDisplay.innerHTML = `<input type="text" id="editNameInput" value="${currentName}" style="padding: 5px; border-radius: 4px; border: 1px solid #2563EB; width: 100%; font-weight: 600;">`;
    editBtn.textContent = "💾 Save Profile";
  }
});

function saveProfile() {
  const newName = document.getElementById("editNameInput").value;
  if (!newName.trim()) return;

  fetch(`${API_URL}/users/${session.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: newName })
  })
  .then(res => res.json())
  .then(updatedUser => {
    const newSession = { ...session, name: updatedUser.name };
    localStorage.setItem("session", JSON.stringify(newSession));
    fullNameDisplay.textContent = updatedUser.name;
    profileNameMain.textContent = updatedUser.name;
    editBtn.textContent = "✏️ Edit Profile";
  });
}

initProfile();
