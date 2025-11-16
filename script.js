document.addEventListener("DOMContentLoaded", () => {
  // ===== STATE GAME =====
  let playerPositions = { player1: 0, player2: 0 };
  let playerNames = { player1: "Pemain 1", player2: "Pemain 2" };
  let currentPlayer = "player1";
  let questions = []; // diisi dari backend
  let canRoll = true;
  let lastRoll = 0;

  // SIMPAN POSISI SEBELUM MAJU (dipakai untuk rollback jika salah)
  let previousPosition = 0;

  // ===== TIMER KUIS =====
  let quizTimerInterval = null;
  let quizTimeLeft = 30; // 30 detik sesuai request

  function formatTime(seconds) {
    const m = String(Math.floor(seconds / 60)).padStart(2, "0");
    const s = String(seconds % 60).padStart(2, "0");
    return `${m}:${s}`;
  }

  function startQuizTimer(duration = 30) {
    stopQuizTimer();
    quizTimeLeft = duration;
    const quizTimerEl = document.getElementById("quiz-timer");
    quizTimerEl.textContent = formatTime(quizTimeLeft);

    quizTimerInterval = setInterval(() => {
      quizTimeLeft -= 1;
      quizTimerEl.textContent = formatTime(Math.max(0, quizTimeLeft));
      if (quizTimeLeft <= 0) {
        stopQuizTimer();
        handleQuizTimeout();
      }
    }, 1000);
  }

  function stopQuizTimer() {
    if (quizTimerInterval) {
      clearInterval(quizTimerInterval);
      quizTimerInterval = null;
    }
  }

  // ===== BOARD MAPPING (tetap seperti aslinya) =====
  const boardCoordinates = {
    0: { x: 5, y: -5 }, // Start
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

  // snakes & ladders mapping
  const snakesAndLadders = {
    2: 23,
    6: 45,
    20: 59,
    52: 72,
    57: 96,
    71: 92,
    100: 100, // menang
    50: 5,
    43: 17,
    56: 8,
    73: 15,
    87: 49,
    84: 58,
    98: 40,
  };

  // ===== DOM ELEMENTS =====
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
  const quizTimerEl = document.getElementById("quiz-timer");

  // ===== INITIALIZE =====
  startGameBtn.addEventListener("click", initGame);

  async function initGame() {
    playerNames.player1 = document.getElementById("player1-name").value || "Pemain 1";
    playerNames.player2 = document.getElementById("player2-name").value || "Pemain 2";

    // pos awal
    updatePawnPosition("player1");
    updatePawnPosition("player2");

    // tampilkan giliran
    turnNameEl.textContent = playerNames[currentPlayer];

    // ambil soal
    try {
      const res = await fetch("get_questions.php");
      questions = await res.json();
      if (!Array.isArray(questions) || questions.length === 0) {
        throw new Error("questions kosong");
      }
    } catch (err) {
      console.error("Gagal memuat soal:", err);
      questions = [{ question: "Terjadi kesalahan memuat soal.", options: ["OK"], answer: "OK" }];
    }

    setupScreen.classList.remove("active");
    gameScreen.classList.add("active");
  }

  // ===== DICE =====
  diceImg.addEventListener("click", rollDice);

  function rollDice() {
    if (!canRoll) return;
    canRoll = false;
    turnNameEl.textContent = playerNames[currentPlayer];

    const roll = Math.floor(Math.random() * 6) + 1;
    lastRoll = roll;
    diceImg.src = `assets/dadu${roll}.png`;

    setTimeout(() => {
      movePlayer(roll);
    }, 500);
  }

  // ===== MOVE PLAYER =====
  function movePlayer(steps) {
    // simpan posisi sebelum bergerak (dipakai untuk rollback)
    previousPosition = playerPositions[currentPlayer];

    let currentPos = playerPositions[currentPlayer];
    let newPos = currentPos + steps;

    // aturan khusus: 93 + 5 = mundur 5
    if (currentPos === 93 && steps === 5) {
      newPos = currentPos - steps;
    } else if (newPos > 100) {
      const overshoot = newPos - 100;
      newPos = 100 - overshoot;
    }

    // cek menang (harus tepat 100)
    if (newPos === 100) {
      playerPositions[currentPlayer] = 100;
      updatePawnPosition(currentPlayer);
      setTimeout(() => {
        alert(`Pemenangnya adalah ${playerNames[currentPlayer]}!`);
        location.reload();
      }, 800);
      return;
    }

    // update posisi sementara (sebelum cek ular/tangga)
    playerPositions[currentPlayer] = newPos;
    updatePawnPosition(currentPlayer);

    // setelah pindah, cek special square
    setTimeout(() => {
      checkSpecialSquaresAndMaybeQuiz();
    }, 800);
  }

  // ===== HANDLE SNAKES & LADDERS + KUIS BEHAVIOR =====
  function checkSpecialSquaresAndMaybeQuiz() {
    const pos = playerPositions[currentPlayer];

    if (snakesAndLadders[pos] !== undefined) {
      const destination = snakesAndLadders[pos];

      // Jika naik (tangga): destination > pos
      if (destination > pos) {
        // simpan posisi sebelum naik tangga tetap berupa previousPosition (sudah disimpan)
        playerPositions[currentPlayer] = destination;
        updatePawnPosition(currentPlayer);

        // Jika tangga membawa tepat ke 100 -> menang tanpa kuis
        if (destination === 100) {
          setTimeout(() => {
            alert(`Pemenangnya adalah ${playerNames[currentPlayer]}!`);
            location.reload();
          }, 800);
          return;
        }

        // Tampilkan kuis setelah naik tangga
        setTimeout(() => {
          showQuiz();
        }, 700);
      } else {
        // Jika turun (ular): destination < pos
        // Terapkan langsung, tetapi **tidak** menampilkan kuis (sesuai permintaan)
        playerPositions[currentPlayer] = destination;
        updatePawnPosition(currentPlayer);

        // setelah turun karena ular, lanjutkan ke giliran berikutnya setelah delay
        setTimeout(() => {
          proceedAfterQuizOrNoQuiz();
        }, 700);
      }
    } else {
      // Kotak biasa -> tampilkan kuis
      setTimeout(() => {
        showQuiz();
      }, 500);
    }
  }

  // ===== UPDATE PAWN POSITION ON BOARD =====
  function updatePawnPosition(player) {
    const pos = playerPositions[player];
    const coords = boardCoordinates[pos];
    const pawn = player === "player1" ? player1Pawn : player2Pawn;

    if (coords) {
      pawn.style.left = `${coords.x}%`;
      pawn.style.bottom = `${coords.y}%`;
      pawn.style.transform = `translate(-50%, 50%)`;
    }
  }

  // ===== TURN MANAGEMENT =====
  function switchTurn() {
    currentPlayer = currentPlayer === "player1" ? "player2" : "player1";
    turnNameEl.textContent = playerNames[currentPlayer];
    canRoll = true;
  }

  function proceedAfterQuizOrNoQuiz() {
    // Dipanggil setelah kuis ditutup atau setelah tidak ada kuis (ular)
    if (lastRoll === 6) {
      // masih giliran sama, boleh kocok lagi
      canRoll = true;
      turnNameEl.textContent = `${playerNames[currentPlayer]} (Kocok Lagi!)`;
    } else {
      switchTurn();
    }
  }

  // ===== KUIS =====
  // showQuiz akan memulai timer; checkAnswer akan menghentikan timer
  function showQuiz() {
    if (!Array.isArray(questions) || questions.length === 0) {
      // fallback singkat
      quizQuestionEl.textContent = "Tidak ada soal.";
      quizOptionsEl.innerHTML = `<button onclick="document.getElementById('close-feedback-btn').click()">OK</button>`;
      quizModal.classList.add("active");
      return;
    }

    // pilih soal acak
    const randomQuestion = questions[Math.floor(Math.random() * questions.length)];

    // tampilkan
    quizQuestionEl.textContent = randomQuestion.question;
    quizOptionsEl.innerHTML = "";
    quizFeedbackEl.innerHTML = "";
    closeFeedbackBtn.style.display = "none";

    // buat tombol opsi
    randomQuestion.options.forEach((opt) => {
      const btn = document.createElement("button");
      btn.textContent = opt;
      btn.addEventListener("click", () => {
        // berhenti timer segera ketika memilih
        stopQuizTimer();
        handleAnswerSelection(opt, randomQuestion.answer);
      });
      quizOptionsEl.appendChild(btn);
    });

    // simpan jawaban benar di dataset untuk referensi timeout jika perlu
    quizModal.dataset.correctAnswer = randomQuestion.answer;

    // tampilkan modal dan mulai timer
    quizModal.classList.add("active");
    startQuizTimer(30);
  }

  // menangani pemilihan jawaban (benar/salah)
  function handleAnswerSelection(selectedOption, correctAnswer) {
    // disable semua opsi
    quizOptionsEl.querySelectorAll("button").forEach((b) => (b.disabled = true));

    if (selectedOption === correctAnswer) {
      quizFeedbackEl.innerHTML = `<span style="color: green;">Jawaban Benar!</span>`;
      // tetap di posisi sekarang (tidak rollback)
    } else {
      quizFeedbackEl.innerHTML = `<span style="color: red;">Jawaban Salah!</span><br>Yang benar adalah: ${correctAnswer}`;
      // rollback ke previousPosition sesuai permintaan (A)
      playerPositions[currentPlayer] = previousPosition;
      updatePawnPosition(currentPlayer);
    }

    // tampilkan tombol lanjut
    closeFeedbackBtn.style.display = "block";
  }

  // jika timer habis -> dianggap salah dan rollback
  function handleQuizTimeout() {
    // disable semua opsi
    quizOptionsEl.querySelectorAll("button").forEach((b) => (b.disabled = true));

    quizFeedbackEl.innerHTML = `<span style="color: red;">Waktu Habis!</span><br>Jawaban dianggap salah.`;
    // rollback
    playerPositions[currentPlayer] = previousPosition;
    updatePawnPosition(currentPlayer);

    closeFeedbackBtn.style.display = "block";
  }

  // tombol lanjut setelah feedback
  closeFeedbackBtn.addEventListener("click", () => {
    // pastikan timer mati
    stopQuizTimer();

    // sembunyikan modal
    quizModal.classList.remove("active");

    // Lanjutkan alur giliran sesuai aturan (6 dapat lagi)
    proceedAfterQuizOrNoQuiz();
  });

  // ===== Prevent clicking dice while modal active (extra guard) =====
  // (canRoll sudah mengontrol, ini hanya safety)
  document.addEventListener("click", (e) => {
    if (quizModal.classList.contains("active")) {
      // jika modal aktif, jangan biarkan klik dadu berefek
      if (e.target && e.target.id === "dice") {
        e.stopPropagation();
        e.preventDefault();
      }
    }
  });
});
