
async function detalhes_cliente_proposta() {
    try {
        const response = await fetch(`${apiBaseUrl}/?route=historico_financiamentos`);
        if (response.ok) {
            const financiamentos = await response.json();
            const tabelaBody = document.getElementById("financiamentos-table-body");
            tabelaBody.innerHTML = ""; // Limpa o conteúdo anterior

            financiamentos.forEach(financiamento => {
                if(financiamento.status == 1){
                    var status = "Pendente de Aprovação";
                }
                if(financiamento.status == 2){
                    var status = "Aprovado";
                }
                if(financiamento.status == 3){
                    var status = "Negado";
                }

                if(financiamento.planideal == 1){
                    var plano = "Plano Solar Pequeno";
                }
                if(financiamento.planideal == 2){
                    var plano = "Plano Solar Medio";
                }
                if(financiamento.planideal == 3){
                    var plano = "Plano Solar Grande";
                }
                const linha = document.createElement("tr");
                linha.innerHTML = `
                    <td>${financiamento.finaid}</td>
                    <td>${financiamento.cliente}</td>
                    <td>${plano}</td>
                    <td>${status}</td>
                    <td><form class="detalhe-proposta">
                    <input type="hidden" id="financiamentoid" value="${financiamento.finaid}">
                    <button type="submit" class="btn-detalhes">Visualizar</button>
                    </form></td>
                `;
                tabelaBody.appendChild(linha);
            });
        } else {
            console.error("Erro ao carregar o histórico de financiamentos");
        }
    } catch (error) {
        console.error("Erro ao buscar histórico de financiamentos:", error);
    }
}


// Atualiza os detalhes do cliente e financiamento ao clicar em "Visualizar"
async function carregarDetalhesFinanciamento(financiamentoId) {
   

    try {
        const response = await fetch(`${apiBaseUrl}/?route=historico_financiamentos_detalhado&id=${financiamentoId}`);
        if (response.ok) {
            const financiamento  = await response.json();

            // Atualiza os detalhes do cliente
            document.getElementById("nomecliente").innerText = financiamento.cliente;
            document.getElementById("endereco_cliente").innerText = financiamento.endereco;
            document.getElementById("email_cliente").innerText = financiamento.email;
            document.getElementById("cpf_cliente").innerText = financiamento.cpf;

            // Atualiza os detalhes do financiamento
            const tabelaDetalhes = document.getElementById("dadoscliente");
            if(financiamento.plano == 1){
                var plano = "Plano Solar Pequeno";
            }
            if(financiamento.plano == 2){
                var plano = "Plano Solar Medio";
            }
            if(financiamento.plano == 3){
                var plano = "Plano Solar Grande";
            }
            tabelaDetalhes.innerHTML = `
                <tr>
                    <td>${financiamento.id}</td>
                    <td>${plano}</td>
                    <td>Todo dia ${financiamento.data_ven}</td>
                    <td>${financiamento.parcela}</td>
                    <td>R$ ${parseFloat(financiamento.valorFinanciamento).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                </tr>
            `;

            // Mostra a seção de aprovação
            document.querySelector(".aprove-section").style.display = "block";
            document.querySelector(".status-section").style.display = "none";

            document.getElementById("id_financiamento").value = financiamento.id;

        } else {
            console.error("Erro ao carregar os detalhes do financiamento.");
        }
    } catch (error) {
        console.error("Erro ao buscar os detalhes do financiamento:", error);
    }
}

// Adiciona o evento ao clicar no botão "Visualizar"
document.addEventListener("click", function (event) {
    if (event.target.classList.contains("btn-detalhes")) {
        event.preventDefault(); // Evita o comportamento padrão do botão
        const financiamentoId = event.target.closest("form").querySelector("input").value;
        carregarDetalhesFinanciamento(financiamentoId);
    }
});

// Carrega a lista inicial de financiamentos
document.addEventListener("DOMContentLoaded", detalhes_cliente_proposta);



document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("aprovar").addEventListener("submit", async (event) => {
        event.preventDefault();
        await atualizarStatusFinanciamento(2); // Status para aprovado
    });

    document.getElementById("negar").addEventListener("submit", async (event) => {
        event.preventDefault();
        await atualizarStatusFinanciamento(3); // Status para negado
    });
});

// Função para atualizar o status do financiamento
async function atualizarStatusFinanciamento(novoStatus) {
    const financiamentoId = document.querySelector("#aprovar input[type='hidden']").value;

    try {
        const response = await fetch(`${apiBaseUrl}/?route=atualizar_financiamento&id=${financiamentoId}&novostatus=${novoStatus}`);

        if (response.ok) {
            alert(`Financiamento ${novoStatus === 2 ? "aprovado" : "negado"} com sucesso!`);
            location.reload(); // Recarrega a página
        } else {
            const error = await response.json();
            console.error("Erro:", error.message);
            alert("Erro ao atualizar status do financiamento.");
        }
    } catch (error) {
        console.error("Erro ao enviar a requisição:", error);
        alert("Erro ao atualizar status do financiamento.");
    }
}
