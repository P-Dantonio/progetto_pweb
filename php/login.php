<?php
// Dettagli di connessione al database
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
$password = $data['password'];

// Prepara ed esegue la query di selezione
$stmt = $connessione->prepare("SELECT password_ FROM user WHERE username = ?");
$stmt->bind_param('s', $username);
$stmt->execute();
$stmt->bind_result($storedPassword);
$stmt->fetch();

// Verifica la password
if ($password === $storedPassword) {
    echo "Login effettuato con successo.";
} else {
    echo "Username o password non corretti.";
}

// Chiude la dichiarazione e la connessione
$stmt->close();
$connessione->close();
?>
