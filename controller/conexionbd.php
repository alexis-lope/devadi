<?php
    // Configuración de la base de datos
    $servidor = "localhost";
    $usuario_db = "root";
    $password_db = "";
    $nombre_db = "dvadi";
    
    // Crear conexión con manejo de errores
    $Ruta = new mysqli($servidor, $usuario_db, $password_db, $nombre_db);
    
    // Verificar conexión
    if ($Ruta->connect_error) {
        die("❌ Error de conexión: " . $Ruta->connect_error);
    }
    
    // Establecer charset
    $Ruta->set_charset("utf8");
    
    // Mensaje de éxito para debug
    echo "✅ Conexión exitosa a la base de datos<br>";
?>
