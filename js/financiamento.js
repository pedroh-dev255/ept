    async function carregarclientes() {
        try {
            const response = await fetch(`${apiBaseUrl}/?route=listar_clientes`);
            if (response.ok) {
                const clientes = await response.json();
                const selectElement = document.getElementById("cliente");
                selectElement.innerHTML = ""; // Limpa o conteúdo anterior

                // Adiciona uma opção inicial
                const defaultOption = document.createElement("option");
                defaultOption.value = "";
                defaultOption.textContent = "Selecione um cliente";
                selectElement.appendChild(defaultOption);

                // Adiciona as opções dos clientes
                clientes.forEach(cliente => {
                    const option = document.createElement("option");
                    option.value = cliente.id; // Define o valor como o ID do cliente
                    option.textContent = cliente.nome; // Define o texto como o nome do cliente
                    selectElement.appendChild(option);
                });
            } else {
                console.error("Erro ao carregar os clientes");
            }
        } catch (error) {
            console.error("Erro ao buscar lista de clientes:", error);
        }
    }

    // Chamada ao carregar a página
    document.addEventListener("DOMContentLoaded", carregarclientes);


    // Função para buscar e exibir o valor do financiamento do cliente selecionado
    async function buscarValorFinanciamento(clienteId) {
        try {
            if (clienteId) {
                const response = await fetch(`${apiBaseUrl}/?route=buscar_financiamento&clienteId=${clienteId}`);
                if (response.ok) {
                    const { valorFinanciamento } = await response.json(); // Supondo que a API retorna { financiamento: valor }
                    const financiamentoInput = document.getElementById("valorFinanciamento");
                    const financiamentotipo = document.getElementById("tipoFinanciamento");
                    const financiamentovalor = document.getElementById("valorFinanciamentoMemo");
                    if (valorFinanciamento == 1) {
                        financiamentotipo.value = "Sistema Solar Pequeno";
                        financiamentoInput.value = "R$ 15.000,00";
                        financiamentovalor.value = "15000";

                    }else if (valorFinanciamento == 2) {
                        financiamentotipo.value = "Sistema Solar Medio";
                        financiamentoInput.value = "R$ 25.000,00";
                        financiamentovalor.value = "25000";
                    } else if (valorFinanciamento == 3) {
                        financiamentotipo.value = "Sistema Solar Grande";
                        financiamentoInput.value = "R$ 40.000,00";
                        financiamentovalor.value = "40000";
                    }else {

                    }
                    
                    console.log(valorFinanciamento);
                     // Atualiza o valor no input
                } else {
                    console.error("Erro ao buscar o financiamento do cliente");
                }
            }
        } catch (error) {
            console.error("Erro ao buscar financiamento:", error);
        }
    }

    


    async function carregarHistoricoFinanciamentos() {
        try {
            const response = await fetch(`${apiBaseUrl}/?route=historico_financiamentos`);
            if (response.ok) {
                const financiamentos = await response.json();
                const tabelaBody = document.getElementById("historicoFinanciamentosBody");
                tabelaBody.innerHTML = ""; // Limpa o conteúdo anterior

                financiamentos.forEach(financiamento => {
                    if(financiamento.status == 1){
                        var status = "Pendente de Aprovação";
                    }if(financiamento.status == 2){
                        var status = "Aprovado";
                    }
                    if(financiamento.status == 3){
                        var status = "Negado";
                    }
                    const linha = document.createElement("tr");
                    linha.innerHTML = `
                        <td>${financiamento.id_fin}</td>
                        <td>${financiamento.cliente}</td>
                        <td>R$ ${parseFloat(financiamento.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</td>
                        <td>${financiamento.parcelamento}</td>
                        <td>${status}</td>
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

    // Chamada ao carregar a página
    document.addEventListener("DOMContentLoaded", carregarHistoricoFinanciamentos);



    function calcularValores() {
        const valorFinanciamento = parseFloat(document.getElementById("valorFinanciamentoMemo").value);
        const parcelas = parseInt(document.getElementById("parcelas").value);
        let taxaJuros = 0;
    
        // Define a taxa de juros com base no número de parcelas
        if (parcelas === 12) {
            taxaJuros = 1.2; // 1.2% ao mês
        } else if (parcelas === 24) {
            taxaJuros = 1.2; // 1.2% ao mês
        } else if (parcelas === 36) {
            taxaJuros = 1.5; // 1.5% ao mês
        }
    
        const taxaJurosDecimal = taxaJuros / 100;
    
        // Fórmula para o cálculo da parcela: PMT = PV * [i * (1 + i)^n] / [(1 + i)^n - 1]
        const parcela =
            valorFinanciamento *
            (taxaJurosDecimal * Math.pow(1 + taxaJurosDecimal, parcelas)) /
            (Math.pow(1 + taxaJurosDecimal, parcelas) - 1);
    
        const valorTotalFinanciamento = parcela * parcelas;
    
        // Atualiza os valores no HTML
        document.getElementById("valorTotalParcela").textContent = `R$ ${parcela.toFixed(2).replace('.', ',')}`;
        document.getElementById("taxaJuros").textContent = `${taxaJuros.toFixed(1)}%`;
        document.getElementById("valorTotalFinanciamento").textContent = `R$ ${valorTotalFinanciamento.toFixed(2).replace('.', ',')}`;
        document.getElementById("valortotal").value = valorTotalFinanciamento.toFixed(2);
        console.log({
            valorFinanciamento,
            taxaJuros,
            parcelas,
            parcela,
            valorTotalFinanciamento,
        });
    }


    async function cadastrofinanciamento(event) {
        event.preventDefault();

        const idclin = document.getElementById("cliente").value;
        const valor = document.getElementById("valortotal").value;
        const parcelas = document.getElementById("parcelas").value;
        const data_vem = document.getElementById("data").value;


        const response = await fetch(`${apiBaseUrl}index.php?route=cadastro_financiamento`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idclin, valor, parcelas, data_vem }),
        });

        const data = await response.json();

        if (response.ok) {
            showMessage("cadastrofin-message", "Cadastro do financiamento realizado com sucesso!", "success");
            setTimeout(() => redirect("./custos.html"), 1000);
        } else {
            showMessage("cadastrofin-message", data.error);
            console.log("erro: "+ data.error);
        }
    }

