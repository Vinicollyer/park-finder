<?php
include 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        $sql = "
            SELECT 
                v.*, 
                r.id_registro, 
                r.data_hora_entrada 
            FROM 
                vagas v
            LEFT JOIN 
                registros r ON v.id_vaga = r.id_vaga_fk AND r.data_hora_saida IS NULL
            ORDER BY 
                v.identificador ASC
        ";
        
        $stmt = $pdo->query($sql);
        $vagas = $stmt->fetchAll();
        
        http_response_code(200);
        echo json_encode($vagas);

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Erro ao buscar vagas: ' . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Método não permitido']);
}
?>