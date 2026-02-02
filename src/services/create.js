const API_URL = "http://localhost:3001";
const session = JSON.parse(localStorage.getItem("session"));

if (!session) {
  window.location.href = "../../public/views/login.html";
}

const form = document.getElementById("createForm");

form.addEventListener("submit", e => {
  e.preventDefault();

  const newTask = {
    title: form.title.value,
    category: form.category.value,
    priority: form.priority.value,
    status: form.status.value,
    dueDate: form.dueDate.value,
    description: form.description.value,
    userId: session.id
  };

  fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newTask)
  }).then(() => {
    window.location.href = "./tasks.html";
  });
});
