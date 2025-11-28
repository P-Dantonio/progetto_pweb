<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Daleks Invasion</title>
    <link rel="icon" href="../img/dw_icon.png" type="image/png">
    <link rel="stylesheet" href="../css/daleksInvasion.css">
    <script src="../javascript/daleksInvasion.js"></script>
</head>
<body>
    <div id="message-box"></div>

    <h1>Daleks Invasion</h1>

    <canvas id="board" width="512" height="512"></canvas>

    <div id="scoreboard">
        <span id="score">Score: 0</span>
    </div>

    <div id="login-form" style="display: block;">
        <p>Username:</p>
        <div class="input-container">
            <input type="text" id="username" placeholder="Username" required="">
        </div>
        <p>Password:</p>
        <div class="input-container">
            <input type="password" id="password" placeholder="Password" required="">
            <span class="togglePassword" id="togglePassword">👁️</span>
        </div>
        <button id="login-button">Login</button>
        <button id="register-button">Registrati</button>
    </div>

    <div id="register-form" style="display: none;">
        <p>Username:</p>
        <div class="input-container">
            <input type="text" id="username_register" placeholder="Username" required="">
        </div>
        <p>Conferma Username:</p>
        <div class="input-container">
            <input type="text" id="confirm_username" placeholder="Conferma username" required="">
        </div>
        <p>Password:</p>
        <div class="input-container">
            <input type="password" id="password_register" placeholder="Password" required="" minlength="8" pattern="(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$">
            <span class="togglePassword" id="toggleRegisterPassword">👁️</span>
        </div>
        <p>Conferma Password:</p>
        <div class="input-container">
            <input type="password" id="confirm_password" placeholder="Conferma password" required="" minlength="8" pattern="(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$">
            <span class="togglePassword" id="toggleConfirmPassword">👁️</span>
        </div>
        <button id="invia">Invia</button>
        <button id="back-to-login">Torna al login</button>
    </div>

    <div id="game-over-message" style="display: none;">
        <p id="game-over-text">Game Over</p>
        <p id="final-score"></p>
        <div id="end-buttons">
            <button id="play-again">Gioca di nuovo</button>
            <button id="back-homepage">Torna alla homepage</button>
            <button id="view-leaderboard">Vedi Classifica</button>
        </div>
    </div>

    <div id="leaderboard-container" class="hide" style="display: none;">
        <button id="back-button" style="display: none;">Indietro</button>
       
    </div>

    <audio id="background-music" src="../music/dr_who_music.mp3" preload="auto" loop></audio>

    <footer>
        <a href="comeGiocare.html">
            <img src="../img/question-mark.png" alt="Help" class="help-icon">
        </a>
    </footer>

</body>
</html>
