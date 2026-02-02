// =======================
// GUARD: SESIÓN Y ROL
// =======================
const session = JSON.parse(localStorage.getItem("session"));

// Si no hay sesión → login
if (!session) {
  window.location.href = "../../public/views/login.html";
}

// Protección por rol según página
const isAdminPage = window.location.pathname.includes("admin.html");
const isUserPage = window.location.pathname.includes("tasks.html");

if (isAdminPage && session.role !== "admin") {
  window.location.href = "../../public/views/login.html";
}

if (isUserPage && session.role !== "user") {
  window.location.href = "../../public/views/login.html";
}

// =======================
// LOGOUT (esperar DOM)
// =======================
document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("session");
      window.location.href = "../../public/views/login.html";
    });
  }
});
