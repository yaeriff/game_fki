document.addEventListener("DOMContentLoaded", () => {
  let playerPositions = { player1: 0, player2: 0 };
  let playerNames = { player1: "Pemain 1", player2: "Pemain 2" };
  let currentPlayer = "player1";
  let questions = []; // Akan diisi dari PHP
  let canRoll = true;
  let lastRoll = 0;

  // --- PEMETAAN PAPAN (PENTING!) ---
  // Papan 50 kotak (10x5).
  // Kita petakan setiap kotak (1-50) ke koordinat (x, y) dalam persen (%)
  // (0,0) adalah kiri bawah, (100,100) adalah kanan atas
  // Ini harus Anda sesuaikan MANUAL agar pas dengan gambar papan Anda.

  // Format: { x: % dari kiri, y: % dari bawah }
  const boardCoordinates = {
    0: { x: 5, y: -5 }, // Posisi Start (di luar papan)
    1: { x: 5, y: 5 },
    2: { x: 15, y: 5 },
    3: { x: 25, y: 5 },
    4: { x: 35, y: 5 },
    5: { x: 45, y: 5 },
    6: { x: 55, y: 5 },
    7: { x: 65, y: 5 },
    8: { x: 75, y: 5 },
    9: { x: 85, y: 5 },
    10: { x: 95, y: 5 },
    11: { x: 95, y: 15 },
    12: { x: 85, y: 15 },
    13: { x: 75, y: 15 },
    14: { x: 65, y: 15 },
    15: { x: 55, y: 15 },
    16: { x: 45, y: 15 },
    17: { x: 35, y: 15 },
    18: { x: 25, y: 15 },
    19: { x: 15, y: 15 },
    20: { x: 5, y: 15 },
    21: { x: 5, y: 25 },
    22: { x: 15, y: 25 },
    23: { x: 25, y: 25 },
    24: { x: 35, y: 25 },
    25: { x: 45, y: 25 },
    26: { x: 55, y: 25 },
    27: { x: 65, y: 25 },
    28: { x: 75, y: 25 },
    29: { x: 85, y: 25 },
    30: { x: 95, y: 25 },
    31: { x: 95, y: 35 },
    32: { x: 85, y: 35 },
    33: { x: 75, y: 35 },
    34: { x: 65, y: 35 },
    35: { x: 55, y: 35 },
    36: { x: 45, y: 35 },
    37: { x: 35, y: 35 },
    38: { x: 25, y: 35 },
    39: { x: 15, y: 35 },
    40: { x: 5, y: 35 },
    41: { x: 5, y: 45 },
    42: { x: 15, y: 45 },
    43: { x: 25, y: 45 },
    44: { x: 35, y: 45 },
    45: { x: 45, y: 45 },
    46: { x: 55, y: 45 },
    47: { x: 65, y: 45 },
    48: { x: 75, y: 45 },
    49: { x: 85, y: 45 },
    50: { x: 95, y: 45 },
    51: { x: 95, y: 55 },
    52: { x: 85, y: 55 },
    53: { x: 75, y: 55 },
    54: { x: 65, y: 55 },
    55: { x: 55, y: 55 },
    56: { x: 45, y: 55 },
    57: { x: 35, y: 55 },
    58: { x: 25, y: 55 },
    59: { x: 15, y: 55 },
    60: { x: 5, y: 55 },
    61: { x: 5, y: 65 },
    62: { x: 15, y: 65 },
    63: { x: 25, y: 65 },
    64: { x: 35, y: 65 },
    65: { x: 45, y: 65 },
    66: { x: 55, y: 65 },
    67: { x: 65, y: 65 },
    68: { x: 75, y: 65 },
    69: { x: 85, y: 65 },
    70: { x: 95, y: 65 },
    71: { x: 95, y: 75 },
    72: { x: 85, y: 75 },
    73: { x: 75, y: 75 },
    74: { x: 65, y: 75 },
    75: { x: 55, y: 75 },
    76: { x: 45, y: 75 },
    77: { x: 35, y: 75 },
    78: { x: 25, y: 75 },
    79: { x: 15, y: 75 },
    80: { x: 5, y: 75 },
    81: { x: 5, y: 85 },
    82: { x: 15, y: 85 },
    83: { x: 25, y: 85 },
    84: { x: 35, y: 85 },
    85: { x: 45, y: 85 },
    86: { x: 55, y: 85 },
    87: { x: 65, y: 85 },
    88: { x: 75, y: 85 },
    89: { x: 85, y: 85 },
    90: { x: 95, y: 85 },
    91: { x: 95, y: 95 },
    92: { x: 85, y: 95 },
    93: { x: 75, y: 95 },
    94: { x: 65, y: 95 },
    95: { x: 55, y: 95 },
    96: { x: 45, y: 95 },
    97: { x: 35, y: 95 },
    98: { x: 25, y: 95 },
    99: { x: 15, y: 95 },
    100: { x: 5, y: 95 },
  };

  // Peta Ular dan Tangga
  // Format: { kotak_awal: kotak_tujuan }
  const snakesAndLadders = {
    // --- Tangga (Naik) ---
    2: 23,
    6: 45,
    20: 59,
    52: 72,
    57: 96,
    71: 92,
    100: 100, // Menang!

    // --- Ular (Turun) ---
    50: 5,
    43: 17,
    56: 8,
    73: 15,
    87: 49,
    84: 58,
    98: 40,
  };

  // --- ELEMEN DOM ---
  const setupScreen = document.getElementById("setup-screen");
  const gameScreen = document.getElementById("game-screen");
  const startGameBtn = document.getElementById("start-game-btn");
  const diceImg = document.getElementById("dice");
  const turnNameEl = document.getElementById("turn-name");
  const player1Pawn = document.getElementById("player1");
  const player2Pawn = document.getElementById("player2");

  const quizModal = document.getElementById("quiz-modal");
  const quizQuestionEl = document.getElementById("quiz-question");
  const quizOptionsEl = document.getElementById("quiz-options");
  const quizFeedbackEl = document.getElementById("quiz-feedback");
  const closeFeedbackBtn = document.getElementById("close-feedback-btn");

  // --- INISIALISASI GAME ---
  startGameBtn.addEventListener("click", initGame);

  async function initGame() {
    // Ambil nama pemain
    playerNames.player1 = document.getElementById("player1-name").value;
    playerNames.player2 = document.getElementById("player2-name").value;

    // Pindahkan bidak ke posisi start (kotak 0)
    updatePawnPosition("player1");
    updatePawnPosition("player2");

    // Tampilkan giliran
    turnNameEl.textContent = playerNames[currentPlayer];

    // Ambil soal dari backend PHP
    try {
      const response = await fetch("get_questions.php");
      questions = await response.json();
    } catch (error) {
      console.error("Gagal memuat soal:", error);
      questions = [{ question: "Error", options: ["A"], answer: "A" }]; // Fallback
    }

    // Tukar layar
    setupScreen.classList.remove("active");
    gameScreen.classList.add("active");
  }

  // --- LOGIKA PERMAINAN ---
  diceImg.addEventListener("click", rollDice);

  function rollDice() {
    if (!canRoll) return; // Jangan lempar dadu jika kuis aktif
    canRoll = false; // Matikan dadu sementara

    // Reset teks "Kocok Lagi!" jika ada
    turnNameEl.textContent = playerNames[currentPlayer];

    let roll = Math.floor(Math.random() * 6) + 1;
    lastRoll = roll;

    // Animasi dadu (ganti gambar)
    diceImg.src = `assets/dadu${roll}.png`;

    // Tunda pergerakan
    setTimeout(() => {
      movePlayer(roll);
    }, 500); // Tunda 0.5 detik
  }

  function movePlayer(steps) {
    let currentPos = playerPositions[currentPlayer];
    let newPos = currentPos + steps;

    // --- LOGIKA ATURAN BARU (MUNDUR JIKA LEBIH) ---

    // 1. Aturan spesifik Anda: 93 + 5 = 88
    if (currentPos === 93 && steps === 5) {
      newPos = currentPos - steps; // Mundur 5 langkah ke 88
    }
    // 2. Aturan umum "Harus Pas 100" (Bounce Back / Mundur)
    else if (newPos > 100) {
      const overshoot = newPos - 100; // Hitung kelebihannya
      newPos = 100 - overshoot; // Mundur dari 100

      // Contoh:
      // Posisi 98, dadu 5. newPos jadi 103.
      // overshoot = 103 - 100 = 3.
      // newPos = 100 - 3 = 97. (Pemain mundur ke 97)
    }

    // --- AKHIR LOGIKA ATURAN BARU ---

    // Cek Menang (HANYA jika newPos TEPAT 100)
    if (newPos === 100) {
      playerPositions[currentPlayer] = 100;
      updatePawnPosition(currentPlayer);

      setTimeout(() => {
        alert(`Pemenangnya adalah ${playerNames[currentPlayer]}!`);
        location.reload();
      }, 1000);
      return; // Hentikan fungsi, jangan tampilkan kuis
    }

    // Jika tidak menang, perbarui posisi
    playerPositions[currentPlayer] = newPos;
    updatePawnPosition(currentPlayer);

    // Tunda untuk cek Ular/Tangga
    setTimeout(() => {
      checkSpecialSquares();
    }, 1000); // Tunda 1 detik setelah pindah
  }

  function checkSpecialSquares() {
    const pos = playerPositions[currentPlayer];

    if (snakesAndLadders[pos]) {
      const destination = snakesAndLadders[pos];
      playerPositions[currentPlayer] = destination;

      // Animasi pindah (Ular/Tangga)
      setTimeout(() => {
        updatePawnPosition(currentPlayer);
        // Tampilkan kuis SETELAH pindah
        setTimeout(showQuiz, 1000);
      }, 500);
    } else {
      // Jika tidak di kotak spesial, langsung tampilkan kuis
      setTimeout(showQuiz, 500);
    }
  }

  function updatePawnPosition(player) {
    const pos = playerPositions[player];
    const coords = boardCoordinates[pos];
    const pawn = player === "player1" ? player1Pawn : player2Pawn;

    if (coords) {
      pawn.style.left = `${coords.x}%`;
      pawn.style.bottom = `${coords.y}%`;
      // Koreksi agar di tengah kotak
      pawn.style.transform = `translate(-50%, 50%)`;
    }
  }

  function switchTurn() {
    currentPlayer = currentPlayer === "player1" ? "player2" : "player1";
    turnNameEl.textContent = playerNames[currentPlayer];
    canRoll = true; // Dadu bisa dilempar lagi
  }

  // --- LOGIKA KUIS ---
  function showQuiz() {
    // Ambil 1 soal acak
    const randomQuestion =
      questions[Math.floor(Math.random() * questions.length)];

    quizQuestionEl.textContent = randomQuestion.question;
    quizOptionsEl.innerHTML = ""; // Kosongkan pilihan sebelumnya
    quizFeedbackEl.innerHTML = "";
    closeFeedbackBtn.style.display = "none";

    // Buat tombol pilihan
    randomQuestion.options.forEach((option) => {
      const button = document.createElement("button");
      button.textContent = option;
      button.addEventListener("click", () =>
        checkAnswer(option, randomQuestion.answer)
      );
      quizOptionsEl.appendChild(button);
    });

    quizModal.classList.add("active");
    // Di sini Anda bisa memulai timer seperti di video
  }

  function checkAnswer(selectedOption, correctAnswer) {
    // Nonaktifkan semua tombol pilihan
    quizOptionsEl
      .querySelectorAll("button")
      .forEach((btn) => (btn.disabled = true));

    if (selectedOption === correctAnswer) {
      quizFeedbackEl.innerHTML =
        '<span style="color: green;">Jawaban Benar!</span>';
    } else {
      quizFeedbackEl.innerHTML = `<span style="color: red;">Jawaban Salah!</span><br>Yang benar adalah: ${correctAnswer}`;
    }

    closeFeedbackBtn.style.display = "block";
  }

  closeFeedbackBtn.addEventListener("click", () => {
    quizModal.classList.remove("active");

    // Logika untuk kocok lagi
    if (lastRoll === 6) {
      // Jika dadu 6:
      // 1. Jangan ganti pemain
      // 2. Izinkan pemain mengocok lagi
      canRoll = true;
      // 3. Beri tahu pemain bahwa dia dapat giliran lagi
      turnNameEl.textContent = `${playerNames[currentPlayer]} (Kocok Lagi!)`;
    } else {
      // Jika bukan 6, ganti giliran seperti biasa
      switchTurn();
    }
  });
});
