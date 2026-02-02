const session = JSON.parse(localStorage.getItem("session"));

document.getElementById("profileName").textContent = session.name;
document.getElementById("profileEmail").textContent = session.email;
document.getElementById("profileRole").textContent = session.role;
