<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');
ini_set('display_errors', 1);
error_reporting(E_ALL);
require_once '../controller/conexionbd.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    $user_id = $data['user_id'] ?? 0;
    $goles1 = $data['goles1'] ?? 0;
    $goles2 = $data['goles2'] ?? 0;
    
    if ($user_id <= 0) {
        echo json_encode([
            'success' => false,
            'message' => 'Usuario no válido'
        ]);
        exit;
    }
    
    $conn = getConnection();
    
    // Determinar resultado
    $resultado = '';
    if ($goles1 > $goles2) {
        $resultado = 'victoria';
    } elseif ($goles1 < $goles2) {
        $resultado = 'derrota';
    } else {
        $resultado = 'empate';
    }
    
    // Actualizar estadísticas
    $stmt = $conn->prepare("
        UPDATE estadisticas 
        SET partidos = partidos + 1,
            victorias = victorias + ?,
            empates = empates + ?,
            derrotas = derrotas + ?,
            goles_favor = goles_favor + ?,
            goles_contra = goles_contra + ?
        WHERE usuario_id = ?
    ");
    
    $victoria = ($resultado === 'victoria') ? 1 : 0;
    $empate = ($resultado === 'empate') ? 1 : 0;
    $derrota = ($resultado === 'derrota') ? 1 : 0;
    
    $stmt->bind_param("iiiiii", $victoria, $empate, $derrota, $goles1, $goles2, $user_id);
    
    if ($stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Resultado guardado exitosamente'
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Error al guardar resultado'
        ]);
    }
    
    $stmt->close();
    $conn->close();
}
?>
