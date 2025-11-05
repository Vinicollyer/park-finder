<?php
include 'config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        $sql = "
            SELECT 
                v.*, 
                r.id_registro, 
                r.data_hora_entrada,
                CASE 
                    WHEN r.id_registro IS NOT NULL THEN 'ocupada'
                    WHEN v.status = 'manutencao' THEN 'manutencao'
                    ELSE 'livre'
                END as status_atual
            FROM 
                vagas v
            LEFT JOIN 
                registros r ON v.id_vaga = r.id_vaga_fk AND r.data_hora_saida IS NULL
            ORDER BY 
                v.identificador ASC
        ";
        
        $stmt = $pdo->query($sql);
        $vagas = $stmt->fetchAll();
        
        // Garante que o status está correto para cada vaga
        foreach ($vagas as $key => $vaga) {
            // Se há registro ativo, a vaga está ocupada
            if (!empty($vaga['id_registro'])) {
                $vagas[$key]['status'] = 'ocupada';
            } elseif ($vaga['status'] === 'manutencao') {
                $vagas[$key]['status'] = 'manutencao';
            } else {
                $vagas[$key]['status'] = 'livre';
            }
        }
        
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