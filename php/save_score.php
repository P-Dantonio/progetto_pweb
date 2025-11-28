<?php
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

// Recupera i dati inviati
$data = json_decode(file_get_contents('php://input'), true);
$username = $data['username'];
$score = $data['score'];

// Prepara e esegue la query di inserimento
$stmt = $connessione->prepare("INSERT INTO punteggi (username, score) VALUES (?, ?)");
$stmt->bind_param('si', $username, $score);

if ($stmt->execute()) {
    echo "Punteggio salvato con successo.";
} else {
    echo "Errore durante il salvataggio del punteggio: " . $connessione->error;
}

// Chiude la dichiarazione e la connessione
$stmt->close();
$connessione->close();
