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
$username = trim($data['username']);  
$password = $data['password'];



// Debug: Verifica i dati ricevuti
error_log("Dati ricevuti - Username: $username, Password: $password");


// Controlla se l'username è già presente nel database
$stmt = $connessione->prepare("SELECT COUNT(*) FROM user WHERE username = ?");
$stmt->bind_param('s', $username);
$stmt->execute();
$stmt->bind_result($count);
$stmt->fetch();

if ($count > 0) {
    echo "Username già presente.";
} else {
    // Se l'username non è presente, procede con la registrazione
    $stmt->close(); // Chiude il primo statement

    // Prepara e esegue la query di inserimento
    $stmt = $connessione->prepare("INSERT INTO user (username, password_) VALUES (?, ?)");
    $stmt->bind_param('ss', $username, $password);

    if ($stmt->execute()) {
        echo "Registrazione avvenuta con successo.";
    } else {
        echo "Errore durante la registrazione: " . $connessione->error;
    }
}

// Chiude la dichiarazione e la connessione
$stmt->close();
$connessione->close();
?>
