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


jsonResponse(['error' => 'Rota não encontrada'], 404);
