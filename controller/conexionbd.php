<?php
function getConnection() {
    $host = 'localhost';
    $dbname = 'cabezones';
    $username = 'root';
    $password = '';
    
    $conn = new mysqli($host, $username, $password, $dbname);
    
    if ($conn->connect_error) {
        die(json_encode([
            'success' => false,
            'message' => 'Error de conexión: ' . $conn->connect_error
        ]));
    }
    
    $conn->set_charset("utf8mb4");
    
    return $conn;
}
?>
