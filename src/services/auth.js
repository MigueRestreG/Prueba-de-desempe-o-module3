const API_URL = "http://localhost:3001";

// =======================
// LOGIN
// =======================
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    fetch(`${API_URL}/users?email=${email}&password=${password}`)
      .then(res => res.json())
      .then(users => {
        if (users.length === 0) {
          alert("Invalid credentials");
          return;
        }

        const user = users[0];

        // Guardar sesión
        localStorage.setItem("session", JSON.stringify(user));

        // Redirigir según rol
        if (user.role === "admin") {
          window.location.href = "../../public/views/admin.html";
        } else {
          window.location.href = "../../public/views/tasks.html";
        }
      });
  });
}

// =======================
// REGISTER
// =======================
const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const newUser = {
      name,
      email,
      password,
      role: "user"
    };

    fetch(`${API_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser)
    })
      .then(() => {
        alert("Account created!");
        window.location.href = "../../public/views/login.html";
      });
  });
}
