<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../controller/conexionbd.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // Decodificar los datos JSON enviados desde JavaScript
    $data = json_decode(file_get_contents('php://input'), true);

    $usuario = trim($data['usuario'] ?? '');
    $email = trim($data['email'] ?? '');
    $password = $data['password'] ?? '';

    // Validaciones básicas
    if (empty($usuario) || empty($email) || empty($password)) {
        echo json_encode([
            'success' => false,
            'message' => 'Todos los campos son requeridos'
        ]);
        exit;
    }

    if (strlen($usuario) < 3) {
        echo json_encode([
            'success' => false,
            'message' => 'El usuario debe tener al menos 3 caracteres'
        ]);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode([
            'success' => false,
            'message' => 'Email inválido'
        ]);
        exit;
    }

    if (strlen($password) < 6) {
        echo json_encode([
            'success' => false,
            'message' => 'La contraseña debe tener al menos 6 caracteres'
        ]);
        exit;
    }

    // Conectar a la base de datos
    $conn = getConnection();

    // Verificar si el usuario o email ya existen
    $stmt = $conn->prepare("SELECT id FROM usuarios WHERE usuario = ? OR email = ?");
    $stmt->bind_param("ss", $usuario, $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows > 0) {
        echo json_encode([
            'success' => false,
            'message' => 'El usuario o email ya existe'
        ]);
        $stmt->close();
        $conn->close();
        exit;
    }

    // Hashear la contraseña
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // Insertar el nuevo usuario
    $stmt = $conn->prepare("INSERT INTO usuarios (usuario, email, password) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $usuario, $email, $hashedPassword);

    if ($stmt->execute()) {
        $user_id = $conn->insert_id;

        // Crear registro de estadísticas asociado al usuario
        $stmtStats = $conn->prepare("INSERT INTO estadisticas (usuario_id, partidos, victorias, empates, derrotas) VALUES (?, 0, 0, 0, 0)");
        $stmtStats->bind_param("i", $user_id);

        if ($stmtStats->execute()) {
           echo json_encode([
                'success' => true,
                'message' => 'Usuario registrado exitosamente',
                'user' => [
                'id' => $user_id,
                'usuario' => $usuario
            ]
    ]);
        } else {
            echo json_encode([
                'success' => false,
                'message' => 'Error al crear estadísticas: ' . $stmtStats->error
            ]);
        }

        $stmtStats->close();
    } else {
        echo json_encode([
            'success' => false,
            'message' => 'Error al registrar usuario: ' . $stmt->error
        ]);
    }

    // Cerrar conexión
    $stmt->close();
    $conn->close();
}
?>