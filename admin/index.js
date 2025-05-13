
const users = {
  admin: "1234",
  admin2: "4567"
};

function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const errorMessage = document.getElementById("errorMessage");

  if (users[username] && users[username] === password) {
    localStorage.setItem("loggedUser", username);
    window.location.href = "./admin.html"; // Redireciona para a página de administração
  } else {
    errorMessage.textContent = "Usuário ou senha inválidos!";
  }
}
