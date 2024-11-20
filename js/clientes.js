async function carregarclientes() {
    try {
        const response = await fetch(`${apiBaseUrl}/?route=listar_clientes`);
        if (response.ok) {
            const clientes = await response.json();
            const tabelaBody = document.getElementById("clientes");
            tabelaBody.innerHTML = ""; // Limpa o conteúdo anterior

            clientes.forEach(clientes => {
                if(clientes.planideal == 1){
                    var plano = "Sistema Solar Pequeno";
                }if(clientes.planideal == 2){
                    var plano = "Sistema Solar Medio";
                }
                if(clientes.planideal == 3){
                    var plano = "Sistema Solar Grande";
                }
                const linha = document.createElement("tr");
                linha.innerHTML = `
                    <td>${clientes.id}</td>
                    <td>${clientes.nome}</td>
                    <td>${plano}</td>
                    <td>${clientes.cpf}</td>
                    <td>${clientes.endereco}</td>
                    <td>${clientes.telefone}</td>
                `;
                tabelaBody.appendChild(linha);
            });
        } else {
            console.error("Erro ao carregar a lista de clientes");
        }
    } catch (error) {
        console.error("Erro ao buscar lista de clientes:", error);
    }
}

document.addEventListener("DOMContentLoaded", carregarclientes);