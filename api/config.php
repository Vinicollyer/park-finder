<?php

// -------------------------------------------------------------------------
// CONFIGURAÇÕES DO BANCO DE DADOS
// -------------------------------------------------------------------------
// ** Mude estas informações para as do seu ambiente **
define('DB_HOST', 'localhost'); // O servidor do seu banco (ex: 'localhost')
define('DB_NAME', 'db_estacionamento'); // O nome do banco de dados
define('DB_USER', 'root'); // Seu usuário do MySQL
define('DB_PASS', ''); // Sua senha do MySQL
define('DB_CHARSET', 'utf8mb4');

// -------------------------------------------------------------------------
// CONFIGURAÇÃO DA TARIFAÇÃO
// -------------------------------------------------------------------------
define('PRECO_POR_HORA', 10.00); // Valor de R$ 10,00 por hora. 
                                // A lógica de cálculo arredonda para cima,
                                // então 1 minuto = 1 hora, 61 minutos = 2 horas.

// -------------------------------------------------------------------------
// CONFIGURAÇÃO DA CONEXÃO PDO (PHP Data Objects)
// -------------------------------------------------------------------------
try {
    // DSN (Data Source Name)
    $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
    
    // Opções do PDO
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION, // Lança exceções em erros
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,       // Retorna resultados como array associativo
        PDO::ATTR_EMULATE_PREPARES   => false,                  // Usa prepared statements reais
    ];

    // Cria a instância do PDO
    $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);

} catch (PDOException $e) {
    // Em caso de falha na conexão, exibe o erro.
    // Em produção, isso deve ser logado, não exibido.
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Falha na conexão com o banco de dados: ' . $e->getMessage()]);
    exit; // Para a execução do script
}

// -------------------------------------------------------------------------
// CABEÇALHOS GLOBAIS DA API
// -------------------------------------------------------------------------
// Define que a resposta será em JSON
header('Content-Type: application/json; charset=utf-8');

// Habilita o CORS (Cross-Origin Resource Sharing)
// Permite que qualquer origem (seu HTML) acesse esta API.
header('Access-Control-Allow-Origin: *'); 

// Define os métodos HTTP permitidos
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');

// Define os cabeçalhos permitidos durante a requisição
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

// O navegador envia uma requisição "OPTIONS" antes de POST/PUT para verificar permissões
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

?>