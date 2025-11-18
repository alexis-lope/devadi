<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
require_once "../controller/conexionbd.php";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $data = json_decode(file_get_contents("php://input"), true);
    
    $user_id = intval($data["user_id"] ?? 0);
    $goles_favor = intval($data["goles_favor"] ?? 0);
    $goles_contra = intval($data["goles_contra"] ?? 0);

    if ($user_id === 0) {
        echo json_encode([
            "success" => false,
            "message" => "Usuario no especificado"
        ]);
        exit;
    }

    $conn = getConnection();

    // Verificar si ya existen estadísticas para este usuario
    $stmt = $conn->prepare("SELECT id, partidos, victorias, empates, derrotas, goles_favor, goles_contra FROM estadisticas WHERE usuario_id = ?");
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    $determinarResultado = function($gf, $gc) {
        if ($gf > $gc) return "victoria";
        if ($gf < $gc) return "derrota";
        return "empate";
    };

    $resultado = $determinarResultado($goles_favor, $goles_contra);

    if ($result->num_rows > 0) {
        // Actualizar estadísticas existentes
        $row = $result->fetch_assoc();
        
        $nuevoPartidos = $row["partidos"] + 1;
        $nuevoVictorias = $row["victorias"] + ($resultado === "victoria" ? 1 : 0);
        $nuevoEmpates = $row["empates"] + ($resultado === "empate" ? 1 : 0);
        $nuevoDerrotas = $row["derrotas"] + ($resultado === "derrota" ? 1 : 0);
        $nuevoGolesFavor = $row["goles_favor"] + $goles_favor;
        $nuevoGolesContra = $row["goles_contra"] + $goles_contra;

        $stmtUpdate = $conn->prepare("
            UPDATE estadisticas 
            SET partidos = ?, victorias = ?, empates = ?, derrotas = ?, goles_favor = ?, goles_contra = ?
            WHERE usuario_id = ?
        ");
        $stmtUpdate->bind_param("iiiiiii", $nuevoPartidos, $nuevoVictorias, $nuevoEmpates, $nuevoDerrotas, $nuevoGolesFavor, $nuevoGolesContra, $user_id);
        
        if ($stmtUpdate->execute()) {
            echo json_encode([
                "success" => true,
                "message" => "Estadísticas actualizadas correctamente"
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Error al actualizar estadísticas"
            ]);
        }
        $stmtUpdate->close();
    } else {
        // Crear nuevas estadísticas
        $partidos = 1;
        $victorias = ($resultado === "victoria" ? 1 : 0);
        $empates = ($resultado === "empate" ? 1 : 0);
        $derrotas = ($resultado === "derrota" ? 1 : 0);

        $stmtInsert = $conn->prepare("
            INSERT INTO estadisticas (usuario_id, partidos, victorias, empates, derrotas, goles_favor, goles_contra)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ");
        $stmtInsert->bind_param("iiiiiii", $user_id, $partidos, $victorias, $empates, $derrotas, $goles_favor, $goles_contra);
        
        if ($stmtInsert->execute()) {
            echo json_encode([
                "success" => true,
                "message" => "Estadísticas creadas correctamente"
            ]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Error al crear estadísticas"
            ]);
        }
        $stmtInsert->close();
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode([
        "success" => false,
        "message" => "Método no permitido"
    ]);
}
?>