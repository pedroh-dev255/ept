    const apiBaseUrl = "http://localhost/siteglobal/API/"; 

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
        
    
    async function logout() {
        sessionStorage.removeItem("isLoggedIn");
        const response = await fetch(`${apiBaseUrl}/?route=logout`, {
        method: "POST",
        });
    
        if (response.ok) {
        // Redireciona para a página de login após deslogar
        window.location.href = "../index.html";
        } else {
        alert("Erro ao deslogar. Tente novamente.");
        }
    }
        
    // Função para buscar e exibir a quantidade de clientes
    async function carregarTotalClientes() {
        try {
            const response = await fetch(`${apiBaseUrl}/?route=total_clientes`);
            if (response.ok) {
                const data = await response.json();
                const totalClientes = data.total || 0; // Fallback para 0 se não houver clientes
                document.getElementById("clientes").textContent = totalClientes;
            } else {
                console.error("Erro ao buscar total de clientes");
            }
        } catch (error) {
            console.error("Erro ao carregar total de clientes:", error);
        }
    }
    
    // Chamada ao carregar a página
    document.addEventListener("DOMContentLoaded", carregarTotalClientes);
    
    // Função para buscar e exibir a quantidade de clientes
    async function projetosAtivos() {
        try {
            const response = await fetch(`${apiBaseUrl}/?route=projetos_ativos`);
            if (response.ok) {
                const data = await response.json();
                const totalprojetos = data.total || 0; // Fallback para 0 se não houver clientes
                document.getElementById("projetos").textContent = totalprojetos;
            } else {
                console.error("Erro ao buscar total de projetos ativos");
            }
        } catch (error) {
            console.error("Erro ao carregar total de projetos ativos:", error);
        }
    }
  
    // Chamada ao carregar a página
    document.addEventListener("DOMContentLoaded", projetosAtivos);
  
  
    
    // Adiciona evento ao botão
    document.getElementById("logout-button").addEventListener("click", logout);