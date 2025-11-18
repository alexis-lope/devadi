<?php
require_once '../controller/conexionbd.php';

$sql = "
SELECT 
    u.usuario,
    e.partidos,
    e.victorias,
    e.empates,
    e.derrotas,
    e.goles_favor,
    e.goles_contra,
    (e.victorias / e.partidos) * 100 AS porcentaje_victorias,
    (e.goles_favor - e.goles_contra) AS goles_totales
FROM estadisticas e
JOIN usuarios u ON e.usuario_id = u.id
WHERE e.partidos >= 10
ORDER BY porcentaje_victorias DESC, goles_totales DESC, e.goles_favor DESC
LIMIT 20;
";
$conn = getConnection();
$result = $conn->query($sql);

echo "<table>";
echo "<tr>
    <th>Pos</th>
    <th>Usuario</th>
    <th>PJ</th>
    <th>V</th>
    <th>E</th>
    <th>D</th>
    <th>Goles</th>
    <th>Contra</th>
    <th>Goles Totales</th>
    <th>% Victorias</th>
</tr>";

$pos = 1;

if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {

        echo "<tr>
            <td>".$pos++."</td>
            <td>".$row['usuario']."</td>
            <td>".$row['partidos']."</td>
            <td>".$row['victorias']."</td>
            <td>".$row['empates']."</td>
            <td>".$row['derrotas']."</td>
            <td>".$row['goles_favor']."</td>
            <td>".$row['goles_contra']."</td>
            <td>".$row['goles_totales']."</td>
            <td>".number_format($row['porcentaje_victorias'], 2)." %</td>
        </tr>";
    }
} else {
    echo "<tr><td colspan='10'>No hay jugadores con 10 o más partidos.</td></tr>";
}

echo "</table>";
