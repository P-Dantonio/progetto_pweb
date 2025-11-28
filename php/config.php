<?php
$host = "127.0.0.1";
$user = "root";
$password = "";
$db = "Dantonio_577966";

$connessione = new mysqli($host, $user, $password, $db);

//Verifica la connessione
if($connessione === false){
    die("Errore durante la connessione: " . $connessione->connect_error);
}

?>