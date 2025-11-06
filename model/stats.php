<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
require_once "../controller/conexionbd.php"; // ajustá la ruta si tu archivo está en otro lugar

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $data = json_decode(file_get_contents("php://input"), true);
    $usuario = trim($data["usuario"] ?? "");

    if ($usuario === "") {
        echo json_encode([
            "success" => false,
            "message" => "Usuario no especificado"
        ]);
        exit;
    }

    $conn = getConnection();

    // Buscar el ID del usuario
    $stmt = $conn->prepare("SELECT id FROM usuarios WHERE usuario = ?");
    $stmt->bind_param("s", $usuario);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        echo json_encode([
            "success" => false,
            "message" => "Usuario no encontrado"
        ]);
        exit;
    }

    $user = $result->fetch_assoc();
    $usuario_id = $user["id"];

    // Obtener estadísticas (ahora con goles)
    $stmt = $conn->prepare("
        SELECT partidos, victorias, empates, derrotas, goles_favor, goles_contra 
        FROM estadisticas 
        WHERE usuario_id = ?
    ");
    $stmt->bind_param("i", $usuario_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        echo json_encode([
            "success" => true,
            "stats" => [
                "partidos" => (int)$row["partidos"],
                "victorias" => (int)$row["victorias"],
                "empates" => (int)$row["empates"],
                "derrotas" => (int)$row["derrotas"],
                "goles_favor" => (int)$row["goles_favor"],
                "goles_contra" => (int)$row["goles_contra"]
            ]
        ]);
    } else {
        // Si el usuario no tiene estadísticas, crear una vacía (ahora con goles)
        $stmtInsert = $conn->prepare("
            INSERT INTO estadisticas 
            (usuario_id, partidos, victorias, empates, derrotas, goles_favor, goles_contra) 
            VALUES (?, 0, 0, 0, 0, 0, 0)
        ");
        $stmtInsert->bind_param("i", $usuario_id);
        $stmtInsert->execute();

        echo json_encode([
            "success" => true,
            "stats" => [
                "partidos" => 0,
                "victorias" => 0,
                "empates" => 0,
                "derrotas" => 0,
                "goles_favor" => 0,
                "goles_contra" => 0
            ]
        ]);
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
