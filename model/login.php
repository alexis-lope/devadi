<?php
include "../controller/conexionbd.php"; // 👈 usamos la conexión

$email = $_POST['email'];
$contrasena = $_POST['contrasena'];

$sql = "SELECT * FROM usuarios WHERE email = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($row = $result->fetch_assoc()) {
    if (password_verify($contrasena, $row['contrasena'])) {
        echo "Login exitoso: " . $row['nombre_usuario'];
    } else {
        echo "Contraseña incorrecta";
    }
} else {
    echo "Usuario no encontrado";
}

?>
