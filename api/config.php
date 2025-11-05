<?php
// -------------------------------------------------------------------------
// CONFIGURAÇÕES DO BANCO DE DADOS
// ** Mude estas informações para as do seu ambiente **
// -------------------------------------------------------------------------
define('DB_HOST', 'localhost');
define('DB_NAME', 'park_finder'); // O nome do banco de dados
define('DB_USER', 'root'); // Seu usuário do MySQL
define('DB_PASS', ''); // Sua senha do MySQL
define('DB_CHARSET', 'utf8mb4');

// -------------------------------------------------------------------------
// CONFIGURAÇÕES DE PREÇO
// -------------------------------------------------------------------------
define('PRECO_POR_HORA', 10.00); // Valor de R$ 10,00 por hora. 
                                  // A lógica de cálculo arredonda para cima,
                                  // então 1 minuto = 1 hora, 61 minutos = 2 horas.

// -------------------------------------------------------------------------
// CONEXÃO COM O BANCO DE DADOS (PDO - PHP Data Objects)
// -------------------------------------------------------------------------
try {
    $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
    $pdo = new PDO($dsn, DB_USER, DB_PASS, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, // Lança exceções em erros
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,       // Retorna resultados como array associativo
        PDO::ATTR_EMULATE_PREPARES => false              // Usa prepared statements reais
    ]);
} catch (PDOException $e) {
    // Em caso de falha na conexão, exibe o erro.
    // Em produção, isso deve ser logado, não exibido.
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Falha na conexão com o banco de dados: ' . $e->getMessage()]);
    exit;
}

// -------------------------------------------------------------------------
// CONFIGURAÇÕES CORS (Cross-Origin Resource Sharing)
// Define que a resposta será em JSON
// -------------------------------------------------------------------------
header('Content-Type: application/json; charset=utf-8');

// Permite que qualquer origem acesse esta API.
// Em produção, substitua '*' pela origem específica do seu frontend.
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Se o navegador envia uma requisição "OPTIONS" antes de POST/PUT para verificar permissões
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
?>
