const apiBaseUrl = "http://localhost/siteglobal/API/"; // Altere para seu servidor

// Frontend: Verifica login no Session Storage
function checkLoginFrontend() {
  if (!sessionStorage.getItem("isLoggedIn")) {
    window.location.href = "../index.html";
  }
}

// Backend: Verifica login com requisição ao servidor
async function checkLoginBackend(route) {
  const response = await fetch(`${apiBaseUrl}/?route=${route}`);
  if (!response.ok) {
    window.location.href = "../index.html";
  }
}
