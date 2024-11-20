<?php
require_once 'config/db.php';

session_start();

header('Content-Type: application/json');

// Função para responder com JSON
function jsonResponse($data, $status = 200) {
    http_response_code($status);
    echo json_encode($data);
    exit;
}

// Rota: /login
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_GET['route'] === 'login') {
    $input = json_decode(file_get_contents('php://input'), true);
    $email = $input['email'] ?? null;
    $senha = $input['senha'] ?? null;

    if (!$email || !$senha) {
        jsonResponse(['error' => 'Email e senha são obrigatórios'], 400);
    }

    $stmt = $pdo->prepare("SELECT * FROM usuarios WHERE email = :email");
    $stmt->execute(['email' => $email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($senha, $user['senha'])) {
        $_SESSION['user_id'] = $user['id'];
        jsonResponse(['message' => 'Login bem-sucedido', 'redirect' => '/']);
    } else {
        jsonResponse(['error' => 'Email ou senha inválidos'], 401);
    }
}

// Rota: /cadastro
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_GET['route'] === 'cadastro') {
    $input = json_decode(file_get_contents('php://input'), true);
    $nome = $input['nome'] ?? null;
    $email = $input['email'] ?? null;
    $senha = $input['senha'] ?? null;

    if (!$nome || !$email || !$senha) {
        jsonResponse(['error' => 'Nome, email e senha são obrigatórios'], 400);
    }

    $senhaHash = password_hash($senha, PASSWORD_DEFAULT);

    try {
        $stmt = $pdo->prepare("INSERT INTO usuarios (nome, email, senha) VALUES (:nome, :email, :senha)");
        $stmt->execute(['nome' => $nome, 'email' => $email, 'senha' => $senhaHash]);
        jsonResponse(['message' => 'Usuário cadastrado com sucesso']);
    } catch (PDOException $e) {
        if($e->getMessage() == "SQLSTATE[23000]: Integrity constraint violation: 1062 Duplicate entry '".$email."' for key 'email'"){
            jsonResponse(['error' => 'Email Já cadastrado'], 500);
        }else {
            jsonResponse(['error' => 'Erro ao cadastrar usuário: ' . $e->getMessage()], 500);
        }
        
    }
}

// Rota: /
if ($_SERVER['REQUEST_METHOD'] === 'GET' && $_GET['route'] === '/') {
    if (!isset($_SESSION['user_id'])) {
        jsonResponse(['error' => 'Acesso não autorizado'], 401);
    }

    $stmt = $pdo->prepare("SELECT nome, email FROM usuarios WHERE id = :id");
    $stmt->execute(['id' => $_SESSION['user_id']]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        jsonResponse(['message' => 'Bem-vindo', 'user' => $user]);
    } else {
        jsonResponse(['error' => 'Usuário não encontrado'], 404);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'GET' && $_GET['route'] === '/') {
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Acesso não autorizado']);
        exit;
    }

    $stmt = $pdo->prepare("SELECT nome, email FROM usuarios WHERE id = :id");
    $stmt->execute(['id' => $_SESSION['user_id']]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        echo json_encode(['message' => 'Bem-vindo', 'user' => $user]);
    } else {
        http_response_code(404);
        echo json_encode(['error' => 'Usuário não encontrado']);
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_GET['route'] === 'logout') {
    session_start();
    session_destroy(); // Destrói a sessão
    echo json_encode(['message' => 'Logout realizado com sucesso']);
    exit;
}




// Rota: /cadastro_cliente
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_GET['route'] === 'cadastro_cliente') {
    $input = json_decode(file_get_contents('php://input'), true);
    $nome = $input['nome'] ?? null;
    $email = $input['email'] ?? null;
    $cpf = $input['cpf'] ?? null;
    $tel = $input['tel'] ?? null;
    $endereco = $input['endereco'] ?? null;
    $plano = $input['plano'] ?? null;

    if (!$nome || !$email || !$cpf || !$tel || !$endereco || !$plano) {
        jsonResponse(['error' => 'Nome, email, cpf, telefone, endereço e plano são obrigatórios'], 400);
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO cliente (nome, email, cpf, telefone, endereco, planideal) VALUES (:nome, :email, :cpf, :tel, :endereco, :plano)");
        $stmt->execute(['nome' => $nome, 'email' => $email, 'cpf' => $cpf, 'tel' => $tel, 'endereco' => $endereco, 'plano' => $plano]);
        jsonResponse(['message' => 'Cliente cadastrado com sucesso']);
    } catch (PDOException $e) {
        if($e->getMessage() == "SQLSTATE[23000]: Integrity constraint violation: 1062 Duplicate entry '".$email."' for key 'email'"){
            jsonResponse(['error' => 'Email Já cadastrado'], 500);
        }else if($e->getMessage() == "SQLSTATE[23000]: Integrity constraint violation: 1062 Duplicate entry '".$cpf."' for key 'cpf'"){
            jsonResponse(['error' => 'CPF Já cadastrado'], 500);
        }else {
            jsonResponse(['error' => 'Erro ao cadastrar usuário: ' . $e->getMessage()], 500);
        }
        
    }
}

// Rota: /cadastro_financiamento
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $_GET['route'] === 'cadastro_financiamento') {
    $input = json_decode(file_get_contents('php://input'), true);
    $idcli = $input['idclin'] ?? null;
    $valor = $input['valor'] ?? null;
    $parcelas = $input['parcelas'] ?? null;
    $data_vem = $input['data_vem'] ?? null;

    if (!$idcli || !$valor || !$parcelas || !$data_vem) {
        jsonResponse(['error' => 'Cliente, Parcelas e Data de Vencimento são obrigatórios'], 400);
    }

    try {
        $stmt = $pdo->prepare("INSERT INTO financiamento (id_cliente, valor, data_vencimento, parcelamento, status) VALUES ( :id_cli, :valor, :data_vem, :parcela,1)");
        $stmt->execute(['id_cli' => $idcli, 'valor' => $valor, 'data_vem' => $data_vem, 'parcela' => $parcelas]);
        jsonResponse(['message' => 'Financiamento cadastrado com sucesso']);
    } catch (PDOException $e) {
        if($e->getMessage()){
            jsonResponse(['error' => 'Erro ao cadastrar usuário: ' . $e->getMessage()], 500);
        }
        
    }
}


// Rota: /total_clientes
if ($_SERVER['REQUEST_METHOD'] === 'GET' && $_GET['route'] === 'total_clientes') {
    try {
        $stmt = $pdo->prepare("SELECT COUNT(*) as total FROM cliente");
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        jsonResponse(['total' => $result['total']]);
    } catch (PDOException $e) {
        jsonResponse(['error' => 'Erro ao buscar total de clientes: ' . $e->getMessage()], 500);
    }
}

// Rota: /projetos_ativos
if ($_SERVER['REQUEST_METHOD'] === 'GET' && $_GET['route'] === 'projetos_ativos') {
    try {
        $stmt = $pdo->prepare("SELECT COUNT(*) as total FROM financiamento WHERE status = 1;");
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        jsonResponse(['total' => $result['total']]);
    } catch (PDOException $e) {
        jsonResponse(['error' => 'Erro ao buscar total de projetos ativos: ' . $e->getMessage()], 500);
    }
}

// Rota: /historico_financiamentos
if ($_SERVER['REQUEST_METHOD'] === 'GET' && $_GET['route'] === 'historico_financiamentos') {
    try {
        $stmt = $pdo->prepare("SELECT *,financiamento.id as id_fin,cliente.id, cliente.nome as cliente, financiamento.id as finaid FROM financiamento INNER JOIN cliente ON cliente.id = financiamento.id_cliente");
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        jsonResponse($result);
    } catch (PDOException $e) {
        jsonResponse(['error' => 'Erro ao buscar histórico de financiamentos: ' . $e->getMessage()], 500);
    }
}

// Rota: /listar_clientes
if ($_SERVER['REQUEST_METHOD'] === 'GET' && $_GET['route'] === 'listar_clientes') {
    try {
        $stmt = $pdo->prepare("SELECT * FROM cliente");
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        jsonResponse($result);
    } catch (PDOException $e) {
        jsonResponse(['error' => 'Erro ao buscar a lista de clientes: ' . $e->getMessage()], 500);
    }
}


// Rota: /buscar_financiamento
if ($_SERVER['REQUEST_METHOD'] === 'GET' && $_GET['route'] === 'buscar_financiamento') {
    $idCliente = $_GET['clienteId'] ?? null;

    if (!$idCliente) {
        jsonResponse(['error' => 'O ID do cliente é obrigatório'], 400);
    }

    try {
        $stmt = $pdo->prepare("SELECT planideal as valor FROM cliente WHERE id = :idCliente LIMIT 1");
        $stmt->execute(['idCliente' => $idCliente]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($result) {
            jsonResponse(['valorFinanciamento' => $result['valor']]);
        } else {
            jsonResponse(['error' => 'Financiamento não encontrado para o cliente especificado'], 404);
        }
    } catch (PDOException $e) {
        jsonResponse(['error' => 'Erro ao buscar o valor do financiamento: ' . $e->getMessage()], 500);
    }
}

// Rota: /historico_financiamentos_detalhado
if ($_SERVER['REQUEST_METHOD'] === 'GET' && $_GET['route'] === 'historico_financiamentos_detalhado') {
    $id = $_GET['id'] ?? null;

    if (!$id) {
        jsonResponse(['error' => 'ID do financiamento é obrigatório'], 400);
    }

    try {
        $stmt = $pdo->prepare("SELECT cliente.nome as nomec, cliente.endereco as enderecoc, cliente.email as emailc,cliente.cpf as cpfc, cliente.planideal as plan, financiamento.id as idfin, financiamento.data_vencimento as data_ven, financiamento.parcelamento as parcela, financiamento.valor as valort FROM financiamento INNER JOIN cliente ON cliente.id = financiamento.id_cliente WHERE financiamento.id = :id LIMIT 1");
        $stmt->execute(['id' => $id]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($result) {
            jsonResponse(['cliente' => $result['nomec'], 'endereco' => $result['enderecoc'], 'email' => $result['emailc'], 'cpf' => $result['cpfc'],  'plano' => $result['plan'], 'id' => $result['idfin'], 'data_ven' => $result['data_ven'], 'parcela' => $result['parcela'], 'valorFinanciamento' => $result['valort'] ]);
        } else {
            jsonResponse(['error' => 'Financiamento não encontrado para o cliente especificado'], 404);
        }
    } catch (PDOException $e) {
        jsonResponse(['error' => 'Erro ao buscar o valor do financiamento: ' . $e->getMessage()], 500);
    }
}


// Rota: /atualizar_financiamento
if ($_SERVER['REQUEST_METHOD'] === 'GET' && $_GET['route'] === 'atualizar_financiamento') {
    $id = $_GET['id'] ?? null;
    $status = $_GET['novostatus'] ?? null;

    if (!$id || !$status) {
        jsonResponse(['error' => 'ID e status são obrigatórios'], 400);
    }

    try {
        $stmt = $pdo->prepare("UPDATE financiamento SET status = :status WHERE id = :id");
        $stmt->execute(['status' => $status, 'id' => $id]);
        jsonResponse(['message' => 'Status atualizado com sucesso']);
    } catch (PDOException $e) {
        jsonResponse(['error' => 'Erro ao atualizar status: ' . $e->getMessage()], 500);
    }
}




jsonResponse(['error' => 'Rota não encontrada'], 404);
