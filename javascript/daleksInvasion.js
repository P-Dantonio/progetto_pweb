let tileSize = 32; // Grandezza di una singola cella della griglia dove si muovono gli oggetti di gioco.
let rows = 16; // Numero righe griglia.
let columns = 16; // Numero colonne griglia.

let board; // Griglia di gioco.
let boardWidth = tileSize * columns;
let boardHeight = tileSize * rows;
let context; 

let shipWidth = tileSize * 2; 
let aspectRatio = 0.7; // Rapporto proporzionale per dimensionare il TARDIS.
let shipHeight = shipWidth / aspectRatio; 
let shipX = tileSize * columns / 2 - shipWidth / 2; // Posizione orizzontale iniziale del TARDIS.
let shipY = tileSize * rows - shipHeight; // Posizione verticale iniziale del TARDIS.
let backgroundMusic; 

let ship = { 
    x: shipX,
    y: shipY,
    width: shipWidth,
    height: shipHeight
};

let tardisImg = new Image();
let dalekImg = new Image();
let spaceImg = new Image(); 
let enterImg = new Image(); 
let shipVelocityX = tileSize; // Velocità del TARDIS quando viene mosso. (Quanto lontano si sposta a dx e a sx).

let daleksArray = []; // Contiene lo stato dei Daleks
let dalekBulletArray = []; // Contiene gli oggetti rappresentati i proiettili.
let dalekBulletVelocityY = 10; 
let daleksWidth = tileSize * 2;
let daleksHeight = tileSize;

let dalekX = tileSize; // Posizione iniziale orizzontale dei Daleks.
let dalekY = tileSize; // Posizione verticale iniziale dei Daleks.

let dalekRows = 2; // Numero di righe iniziale della matrice Daleks.
let dalekColumns = 3; // Numero di colonne iniziale della matrice Daleks.
let dalekCount = 0;
let dalekVelocityX = 1; 

let bulletArray = []; // Memorizza i proiettili sparati dal giocatore.
let tardisBulletVelocity = -10; // Velocità dei proiettili del TARDIS (si muovono verso l'alto).

let score = 0;
let gameOver = false;
let gameStarted = false;

let posizione = 1; // E' una variabile che tiene traccia della posizione corrente nella classifica quando viene visualizzata. 
                  


// Mostra un messaggio temporaneo sullo schermo, cambiando colore in base al tipo di messaggio (successo, errore, altro genere).

function showMessage(message, type = 'info') {
    const messageBox = document.getElementById('message-box');
    messageBox.textContent = message;
    
    switch(type) {
        case 'success':
            messageBox.style.backgroundColor = 'green';
            break;
        case 'error':
            messageBox.style.backgroundColor = 'red';
            break;
        default:
            messageBox.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    }
    
    messageBox.style.display = 'block';
    
    setTimeout(() => {
        messageBox.style.display = 'none';
    }, 3000); 
}


//  Inizializza il gioco, caricando immagini, gestendo la visualizzazione e collegando eventi come il login e la registrazione.

window.onload = function () {
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d");

    tardisImg.src = "../img/tardis_pixel.png";
    dalekImg.src = "../img/dalek_pixel.png";
    spaceImg.src = "../img/space.jpg"; 

    document.getElementById('back-button').style.display = 'none';
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('game-over-message').style.display = 'none';
    document.getElementById('leaderboard-container').style.display = 'none';
    



    tardisImg.onload = () => {
        dalekImg.onload = () => {
            spaceImg.onload = () => { 
                showStartScreen();
                document.addEventListener("keydown", handleKeydown);
            };
        };
    };

    document.getElementById('login-button').addEventListener('click', handleLoginClick);
    document.getElementById('register-button').addEventListener('click', handleRegisterClick);

    const passwordInputRegister = document.getElementById('password_register');

    function setupPasswordToggle(passwordInputId, toggleButtonId) {
        
        const passwordInput = document.getElementById(passwordInputId);
        const toggleButton = document.getElementById(toggleButtonId);
        
        toggleButton.addEventListener('mousedown', () => {
            passwordInput.type = 'text';
        });
        toggleButton.addEventListener('mouseup', () => {
            passwordInput.type = 'password';
        });
    }

    // Gestisce gli interruttori che permettono di visualizzare la password come testo

    setupPasswordToggle('password', 'togglePassword');
    
    setupPasswordToggle('password_register','toggleRegisterPassword');
    
    setupPasswordToggle('confirm_password','toggleConfirmPassword');
    
    
    // Gestisce il numero minimo di caratteri della password

    passwordInputRegister.addEventListener('keydown', function () {

        if (passwordInputRegister.value.length + 1 < 8) {

            passwordInputRegister.style.backgroundColor = 'red';
           
        } else{

            passwordInputRegister.style.backgroundColor = 'white';
        }
    });

   
};

// Visualizza la schermata iniziale del gioco con il messaggio di benvenuto e un'istruzione per avviare il gioco.

function showStartScreen() {
    context.clearRect(0, 0, board.width, board.height);

    backgroundMusic = document.getElementById("background-music");
    backgroundMusic.play();

    let backButton = document.getElementById("back-button");
    backButton.style.display = "none";

    context.fillStyle = "green";
    context.font = "20px 'Courier New'"; 

    
    let message = "Benvenuto in DALEKS INVASION. Proteggi l'universo insieme al dottore!. ALLONS-Y!";

    
    let lines = message.split('.').map(line => line.trim()).filter(line => line.length > 0);

    
    let x = boardWidth / 2;
    let y = boardHeight / 2 - (lines.length * 25 / 2) - 20;

    
    let rectHeight = lines.length * 25 + 50 + daleksHeight + 100; 

    
    context.fillStyle = "rgba(0, 0, 0, 0.8)";
    context.fillRect(0, y - 20, boardWidth, rectHeight);

    
    context.fillStyle = "green";
    context.textAlign = "center";
    lines.forEach((line, index) => {
        context.fillText(line, x, y + index * 25);
    });

    
    context.drawImage(dalekImg, boardWidth / 2 - daleksWidth / 2, y + lines.length * 25 + 20, daleksWidth, daleksHeight);

    
    context.fillText("Premi invio per iniziare", x, y + lines.length * 25 + 20 + daleksHeight + 30);
}


// Rileva il tasto "Enter" per iniziare il gioco mostrando il form di login.

function handleKeydown(e) {
    if (e.code === "Enter") {
        if (!gameStarted) {
            document.getElementById('login-form').style.display = 'block'; 
            document.removeEventListener("keydown", handleKeydown); 
        }
    }
}

// Verifica che l'utente abbia inserito username e password, e avvia la verifica del login.

function handleLoginClick() {
    let usernameInput = document.getElementById('username').value;
    let passwordInput = document.getElementById('password').value;

    if (usernameInput === "" || passwordInput === "") {
        showMessage("Per favore, inserisci un username e una password.", "error");
        return;
    }

    checkLogin(usernameInput, passwordInput);
}

// Invia i dati di login al server per la verifica e gestisce la risposta.

function checkLogin(username, password) {
    const data = { username: username, password: password };

    fetch('../php/login.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.text())
    .then(data => {
        console.log("Server response:", data);

        if (data === "Login effettuato con successo.") {
            startGame(); 
        } else {
            showMessage("Username o password non corretti.", "error");
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showMessage("Si è verificato un errore durante la verifica. Per favore, riprova.", "error");
    });
}

// Mostra il modulo di registrazione e nasconde il modulo di login.

function handleRegisterClick() {
    
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';

    document.getElementById("invia").addEventListener('click', handleSubmitClick);
    document.getElementById("back-to-login").addEventListener('click', backToLogin);
}

// Nasconde il modulo di registrazione e mostra il modulo di login.

function backToLogin() {
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
}

// Testa la password e si assicura che rispetti il pattern.

function test(password) {
    
    const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordPattern.test(password);
}

// Controlla se username e password corrispondono e se la password è valida, quindi avvia la registrazione.

function handleSubmitClick() {
    let usernameInput = document.getElementById('username_register').value;  
    let passwordInput = document.getElementById('password_register').value; 
    let confirmPassword = document.getElementById('confirm_password').value;
    let confirmUsername = document.getElementById('confirm_username').value; 

    console.log(usernameInput);

    if(confirmPassword != passwordInput){
        showMessage("Le password inserite non corrispondono", "error");
        return;
    }

    if(confirmUsername != usernameInput){
        showMessage("I nomi utenti inseriti non corrispondono", "error");
        return;
    }

    if (usernameInput === "" || passwordInput === "") {
        showMessage("Per favore, inserisci un username e una password.", "error");
        return;
    }

    passwordValid = test(passwordInput);

    console.log(passwordInput);

    if(!passwordValid){
        showMessage("La password non rispetta i requisiti. Inserire (min.8 caratteri, min. 1 lettera, min. 1 numero, min. 1 carattere tra i seguenti {@$!%*?&})");
        return;
    }

    checkSubmit(usernameInput, passwordInput);
}

// Invia i dati di registrazione al server e gestisce la risposta 

function checkSubmit(username, password) {
    console.log("sei in chackSubmit");

    const data = { username: username, password: password };

    console.log("Dati inviati al server:", data);

    fetch('../php/register.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.text())
    .then(data => {
        console.log("Risposta del server:", data);

        if (data === "Registrazione avvenuta con successo.") {
            showMessage("Registrazione avvenuta con successo! Torna al login per accedere.", "success");
        } else {
            showMessage("Errore durante la registrazione: " + data, "error");
        }
    })
    .catch(error => {
        console.error('Error:', error);
        showMessage("Si è verificato un errore durante la registrazione. Per favore, riprova.", "error");
    });
}

// Avvia il gioco, attivando gli eventi di movimento e sparo e chiamando la funzione che genera i Daleks.

function startGame() {
    gameStarted = true;
    document.getElementById('login-form').style.display = 'none';  
    document.addEventListener("keydown", moveShip);
    document.addEventListener("keyup", shoot);
    createDaleks(); 
    startDalekBulletTimer(); 
    requestAnimationFrame(update);  
}

// Aggiorna continuamente la posizione della nave, dei Dalek,
// dei proiettili, e verifica le collisioni, gestendo il punteggio e lo stato di fine gioco.

function update() {
    if (!gameStarted) {
        return;
    }

    
    let finalScore = document.getElementById('final-score');
    finalScore.innerText = `Score: ${score}`;

    
    if (gameOver) {
        endGame(); 
        return; 
    }

    
    context.drawImage(spaceImg, 0, 0, boardWidth, boardHeight);

    
    context.drawImage(tardisImg, ship.x, ship.y, ship.width, ship.height);

    
    for (let i = 0; i < daleksArray.length; i++) {
        let dalek = daleksArray[i];
        if (dalek.alive) {
            dalek.x += dalekVelocityX;

            if (dalek.x + dalek.width >= board.width || dalek.x <= 0) {
                dalekVelocityX *= -1;
                dalek.x += dalekVelocityX * 2;

                for (let j = 0; j < daleksArray.length; j++) {
                    daleksArray[j].y += daleksHeight; 
                }
            }

            context.drawImage(dalekImg, dalek.x, dalek.y, dalek.width, dalek.height);

            if (dalek.y >= ship.y) {
                gameOver = true;
                document.getElementById('score').innerText = `Score: ${score} (Game Over)`;
            }
        }
    }

    
    for (let i = 0; i < dalekBulletArray.length; i++) {
        let bullet = dalekBulletArray[i];
        bullet.y += dalekBulletVelocityY;  
        context.fillStyle = "red";
        context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

        
        if (detectCollision(bullet, ship)) {
            score -= 50;  
            bullet.used = true;  
            if (score < 0) {
                score = 0;
                gameOver = true;
            }
            document.getElementById('score').innerText = `Score: ${score} (Game Over)`;
        }
    }

    while (dalekBulletArray.length > 0 && (dalekBulletArray[0].y > board.height || dalekBulletArray[0].used)) {
        dalekBulletArray.shift();
    }

    
    for (let i = 0; i < bulletArray.length; i++) {
        let bullet = bulletArray[i];
        bullet.y += tardisBulletVelocity;
        context.fillStyle = "white";
        context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

        for (let j = 0; j < daleksArray.length; j++) {
            let dalek = daleksArray[j];
            if (!bullet.used && dalek.alive && detectCollision(bullet, dalek)) {
                bullet.used = true;
                dalek.alive = false;
                dalekCount--;
                score += 100;
                context.fillStyle = "red";
                context.fillRect(dalek.x, dalek.y, dalek.width, dalek.height);
            }
        }
    }

    while (bulletArray.length > 0 && (bulletArray[0].used || bulletArray[0].y < 0)) {
        bulletArray.shift();
    }

    if (dalekCount == 0) {
        score += dalekColumns * dalekRows * 100;
        dalekColumns = Math.min(dalekColumns + 1, 5);
        dalekRows = Math.min(dalekRows + 1, 7);
        dalekVelocityX += (dalekVelocityX > 0) ? 0.4 : -0.4;

        
        daleksWidth = Math.max(daleksWidth - 2, tileSize);
        daleksHeight = Math.max(daleksHeight - 2, tileSize / 2);

        daleksArray = [];
        bulletArray = [];
        dalekBulletArray = []; 
        createDaleks();
    }

    document.getElementById('score').innerText = `Score: ${score}`;
    requestAnimationFrame(update);
}

// Controlla le collisioni fra due oggetti.

function detectCollision(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
}

// Gestisce il tiro di un proiettile dalla nave quando viene premuta la barra spaziatrice.

function shoot(e) {
    if (e.code === "Space" && !gameOver) {
        let bullet = {
            x: ship.x + ship.width / 2 - 2,
            y: ship.y,
            width: 4,
            height: 10,
            used: false
        };
        bulletArray.push(bullet);
    }
}

// Muove il TARDIS in base al tasto premuto.

function moveShip(e) {
    if (gameOver) {
        return;
    }

    if (e.code === "ArrowLeft" && ship.x > 0) {
        ship.x -= shipVelocityX;
    } else if (e.code === "ArrowRight" && ship.x < boardWidth - shipWidth) {
        ship.x += shipVelocityX;
    }
}

// Crea una griglia di Daleks che vengono poi visualizzati nel gioco

function createDaleks() {
    daleksArray = [];
    dalekCount = 0;

   
    const maxColumns = 5;
    const effectiveColumns = Math.min(dalekColumns, maxColumns);

    const maxRows = 10;
    const effectiveRows = Math.min(dalekRows, maxRows);

    console.log(effectiveColumns);

    for (let i = 0; i < effectiveRows; i++) {
        for (let j = 0; j < effectiveColumns; j++) {
            daleksArray.push({
                x: dalekX + j * (daleksWidth + tileSize),
                y: dalekY + i * (daleksHeight + tileSize),
                width: daleksWidth,
                height: daleksHeight,
                alive: true
            });
            dalekCount++;
        }
    }
}

let dalekBulletTimerId; 

// Gestisce l'intervallo di sparo dei Daleks

function startDalekBulletTimer() {
    if (dalekBulletTimerId) return;

    dalekBulletTimerId = setInterval(() => {
        if (gameOver) {
            clearInterval(dalekBulletTimerId); 
            dalekBulletTimerId = null;
            return;
        }

        let aliveDaleks = daleksArray.filter(dalek => dalek.alive);
        if (aliveDaleks.length > 0) {
            let randomDalek = aliveDaleks[Math.floor(Math.random() * aliveDaleks.length)];
            let bullet = {
                x: randomDalek.x + randomDalek.width / 2 - 2,
                y: randomDalek.y + randomDalek.height,
                width: 4,
                height: 10,
                used: false
            };
            dalekBulletArray.push(bullet);
        }
    }, 1000); 
}

// Termina il gioco, rimuove gli eventi e gestisce la visualizzazione del punteggio finale e dei pulsanti di fine gioco.

function endGame() {
    document.removeEventListener("keydown", moveShip);
    document.removeEventListener("keyup", shoot);

    document.getElementById('game-over-message').style.display = 'block';
    document.getElementById('end-buttons').style.display = 'block';

    let finalScore = document.getElementById('final-score');
    finalScore.innerText = `Final Score: ${score}`;

    
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0; 

  
    let username = document.getElementById('username').value;

   
    if (username) {
        sendScoreToServer(username, score);
    }

    document.getElementById('play-again').addEventListener('click', handlePlayAgain);
    document.getElementById('view-leaderboard').addEventListener('click', handleViewLeaderboard);
    document.getElementById('back-homepage').addEventListener('click', handleBackHomePage);



}

// Gestisce il tasto che permette di tornare alla pagina iniziale.

function handleBackHomePage() {

    document.getElementById('game-over-message').style.display = 'none';
    document.getElementById('end-buttons').style.display = 'none';
    document.getElementById('leaderboard-container').style.display = 'none';

    window.location.reload();
}

// Gestisce il tasto che permette di rigiocare la partita usando lo stesso account.

function handlePlayAgain() {
    resetGame();
    startGame();
}

// Gestisce la tabella con la classifica eliminando la vecchia tabella e mostrando la nuova.

function handleViewLeaderboard() {
    let oldTable = document.querySelector('#leaderboard-container table');
    if(oldTable){
        oldTable.remove();
    }
    showLeaderboard();
}

// Nasconde tutti gli elementi a schermo mostrando la classifica aggiornata in base all'ultima partita giocata.

function showLeaderboard() {
   
    document.getElementById('game-over-text').style.display = 'none';
    document.getElementById('final-score').style.display = 'none';
    document.getElementById('end-buttons').style.display = 'none';
    document.getElementById('game-over-message').style.display = 'none';

 
    document.getElementById('leaderboard-container').style.display = 'flex';
    document.getElementById('back-button').style.display = 'block'; 

    document.getElementById('back-button').addEventListener('click', hideLeaderboard);

  
    // Recupera la classifica dal server e crea la tabella.
    fetch('../php/space.php')
        .then(response => response.json()) 
        .then(data => {
           
            console.log("sei nella generazione tabella" + data);
            let tabella = `
                <table id="classifica">
                    <thead>
                        <tr>
                            <th>Posizione</th>
                            <th>Username</th>
                            <th>Punteggio</th>
                            <th>Data e ora</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${generaRighe(data)}
                    </tbody>
                </table>
            `;

            let tabellaContainer = document.querySelector("#leaderboard-container");
            tabellaContainer.insertAdjacentHTML('beforeend', tabella);
        })
        .catch(error => console.error('Error:', error))

       
}

// Nasconde la tabella tornando alla schermata di fine gioco.

function hideLeaderboard() {
   
    document.getElementById('leaderboard-container').style.display = 'none';
    document.getElementById('back-button').style.display = 'none';

    
    document.getElementById('game-over-text').style.display = 'block';
    document.getElementById('final-score').style.display = 'block';
    document.getElementById('end-buttons').style.display = 'block';
    document.getElementById('game-over-message').style.display = 'block';
}

// Genera le righe della classifica utilizzando i dati prensenti nel database.

function generaRighe(data){
    let righe = '';
    data.forEach(persona => {
        let riga = `
        <tr>
            <td>${posizione++}</td>
            <td>${persona.username}</td>
            <td>${persona.score}</td>
            <td>${persona.date}</td>
        </tr>
        `;
        righe += riga;
    });
    console.log(righe);
    return righe;
}

// Invia il punteggio della partita e il relativo username al server.

function sendScoreToServer(username, score) {
    console.log('sei in sendScore');

    fetch('../php/save_score.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username, score: score })
    })
        .then(response => response.text())
        .then(data => console.log(data))
        .catch(error => console.error('Error:', error));
}

// Resetta variabili e listeners e permette di avviare una nuova partita utilizzando lo stesso account.

function resetGame() {
    
    document.getElementById('game-over-message').style.display = 'none';
    document.getElementById('end-buttons').style.display = 'none';
    document.getElementById('leaderboard-container').style.display = 'none';

    
    score = 0;
    posizione = 1;
    gameOver = false;
    daleksArray = [];
    bulletArray = [];
    dalekBulletArray = [];
    tileSize = 32;

    
    ship.x = shipX;
    ship.y = shipY;

    dalekColumns = 3;
    dalekRows = 2;
    dalekVelocityX = 1;
    dalekBulletVelocityY = 10;
    daleksWidth = tileSize * 2;
    daleksHeight = tileSize;

    console.log(daleksWidth);
    console.log(tileSize);

    
    backgroundMusic.currentTime = 0; 
    backgroundMusic.play();

    
    document.removeEventListener("keydown", moveShip);
    document.removeEventListener("keyup", shoot);

    document.getElementById('play-again').removeEventListener('click', handlePlayAgain);
    document.getElementById('view-leaderboard').removeEventListener('click', handleViewLeaderboard);
    document.getElementById('back-homepage').removeEventListener('click', handleBackHomePage);

    
    if (dalekBulletTimerId) {
        clearInterval(dalekBulletTimerId);
        dalekBulletTimerId = null;
    }

    
    document.addEventListener("keydown", moveShip);
    document.addEventListener("keyup", shoot);

    
    createDaleks();
    startDalekBulletTimer(); 

    

}
