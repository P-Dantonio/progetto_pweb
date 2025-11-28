<?php
// Dettagli connessione
$host = "127.0.0.1";
$user = "root";
$password = "";
$database = "Dantonio_577966";

// Creazione connessione
$connessione = new mysqli($host, $user, $password, $database);

// Controllo connessione
if ($connessione->connect_errno) {
    die("Errore di connessione: " . $connessione->connect_error);
}

// Query di selezione per ottenere la classifica ordinata per punteggio in ordine decrescente
$sql = "SELECT id, username, score, date FROM punteggi ORDER BY score DESC LIMIT 10";
$result = $connessione->query($sql);

$leaderboard = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $leaderboard[] = $row;
    }
}

header('Content-Type: application/json');
echo json_encode($leaderboard);

// Chiude la connessione
$connessione->close();
?>
