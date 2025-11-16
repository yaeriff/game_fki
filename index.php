<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ular Tangga Edukasi</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <div id="setup-screen" class="screen active">
        <h1>Ular Tangga</h1>
        <h2>Filsafah Kesatuan Ilmu</h2>
        <div class="player-input">
            <label for="player1-name">Nama Pemain 1:</label>
            <input type="text" id="player1-name" value="Pemain 1">
        </div>
        <div class="player-input">
            <label for="player2-name">Nama Pemain 2:</label>
            <input type="text" id="player2-name" value="Pemain 2">
        </div>
        <button id="start-game-btn">Mulai Bermain</button>
    </div>

    <div id="game-screen" class="screen">
        <div id="game-board">
            <div id="player1" class="pawn"></div>
            <div id="player2" class="pawn"></div>
        </div>
        
        <div id="game-controls">
            <div id="player-turn">Giliran: <span id="turn-name"></span></div>
            <img id="dice" src="assets/dadu1.png" alt="Dadu">
            <div id="dice-result"></div>
        </div>
    </div>

    <div id="quiz-modal" class="modal-overlay">
        <div class="modal-content">
            <div id="quiz-timer">00:59</div>
            <h3 id="quiz-question"></h3>
            <div id="quiz-options">
                </div>
            <div id="quiz-feedback"></div>
            <button id="close-feedback-btn">Lanjut</button>
        </div>
    </div>

    <script src="script.js"></script>
</body>
</html>