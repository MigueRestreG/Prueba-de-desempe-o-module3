const session = JSON.parse(localStorage.getItem("session"));

// Si no hay sesión → login
if (!session) {
  window.location.href = "../../public/views/login.html";
} else {
  // Redirigir según rol
  if (session.role === "admin") {
    window.location.href = "../../public/views/admin.html";
  } else {
    window.location.href = "../../public/views/tasks.html";
  }
}
