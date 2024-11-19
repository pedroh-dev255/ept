const apiBaseUrl = "http://localhost/siteglobal/API/"; // Altere conforme necessário

// Função para exibir mensagens de erro ou sucesso
function showMessage(elementId, message, type = "error") {
  const element = document.getElementById(elementId);
  element.textContent = message;
  element.className = type;
}

// Função para redirecionar
function redirect(url) {
  window.location.href = url;
}

// Função para login
async function login(event) {
  event.preventDefault();

  const email = document.getElementById("login-email").value;
  const senha = document.getElementById("login-senha").value;

  const response = await fetch(`${apiBaseUrl}/?route=login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, senha }),
  });

  const data = await response.json();

  if (response.ok) {
    showMessage("login-message", "Login bem-sucedido!", "success");
    setTimeout(() => redirect("./html/pginicial.html"), 1000);
  } else {
    showMessage("login-message", data.error);
  }
}

// Função para cadastro
async function cadastro(event) {
  event.preventDefault();

  const nome = document.getElementById("cadastro-nome").value;
  const email = document.getElementById("cadastro-email").value;
  const senha = document.getElementById("cadastro-senha").value;

  const response = await fetch(`${apiBaseUrl}/?route=cadastro`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, email, senha }),
  });

  const data = await response.json();

  if (response.ok) {
    showMessage("cadastro-message", "Cadastro realizado com sucesso!", "success");
    setTimeout(() => redirect("../index.html"), 1000);
  } else {
    showMessage("cadastro-message", data.error);
  }
}


async function login(event) {
    event.preventDefault();
  
    const email = document.getElementById("login-email").value;
    const senha = document.getElementById("login-senha").value;
  
    const response = await fetch(`${apiBaseUrl}/?route=login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });
  
    const data = await response.json();
  
    if (response.ok) {
      // Salva o estado de login
      sessionStorage.setItem("isLoggedIn", "true");
      showMessage("login-message", "Login bem-sucedido!", "success");
      setTimeout(() => redirect("./html/pginicial.html"), 1000);
    } else {
      showMessage("login-message", data.error);
    }
  }

  async function logout() {
    const response = await fetch(`${apiBaseUrl}/?route=logout`, {
      method: "POST",
    });
  
    if (response.ok) {
      // Redireciona para a página de login após deslogar
      window.location.href = "index.html";
    } else {
      alert("Erro ao deslogar. Tente novamente.");
    }
  }



// Função para cadastro
async function cadastro_cliente(event) {
  event.preventDefault();

  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const cpf = document.getElementById("cpf").value;
  const tel = document.getElementById("tel").value;
  const endereco = document.getElementById("endereco").value;
  const plano = document.getElementById("plano").value;

  const response = await fetch(`${apiBaseUrl}/?route=cadastro_cliente`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nome, email, cpf, tel, endereco, plano }),
  });

  const data = await response.json();

  if (response.ok) {
    showMessage("cadastro-message", "Cadastro do cliente realizado com sucesso!", "success");
    setTimeout(() => redirect("../index.html"), 1000);
  } else {
    showMessage("cadastro-message", data.error);
  }
}


  
  // Adiciona evento ao botão
  document.getElementById("logout-button").addEventListener("click", logout);