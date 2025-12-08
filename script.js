document.addEventListener("DOMContentLoaded", () => {
  // ===== STATE GAME =====
  let playerPositions = { player1: 0, player2: 0 };
  let playerNames = { player1: "Pemain 1", player2: "Pemain 2" };
  let currentPlayer = "player1";
  let questions = []; // diisi dari backend
  let canRoll = true;
  let lastRoll = 0;

  // CONTEXT KUIS (Menentukan nasib setelah menjawab)
  let quizContext = {
    type: "normal",
    targetPosition: 0,
  };

  // ===== TIMER KUIS =====
  let quizTimerInterval = null;
  let quizTimeLeft = 30;

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

  // ===== BOARD MAPPING (100 KOTAK) =====
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

  // ===== INITIALIZE =====
  startGameBtn.addEventListener("click", initGame);

  async function initGame() {
    playerNames.player1 =
      document.getElementById("player1-name").value || "Pemain 1";
    playerNames.player2 =
      document.getElementById("player2-name").value || "Pemain 2";

    updatePawnPosition("player1");
    updatePawnPosition("player2");

    turnNameEl.textContent = playerNames[currentPlayer];

    try {
      const res = await fetch("get_questions.php");
      questions = await res.json();
      if (!Array.isArray(questions) || questions.length === 0) {
        throw new Error("questions kosong");
      }
    } catch (err) {
      console.error("Gagal memuat soal:", err);
      questions = [
        {
          question: "Terjadi kesalahan memuat soal.",
          options: ["OK"],
          answer: "OK",
        },
      ];
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
    let currentPos = playerPositions[currentPlayer];
    let newPos = currentPos + steps;

    // Aturan khusus: 93 + 5 = mundur 5
    if (currentPos === 93 && steps === 5) {
      newPos = currentPos - steps;
    } else if (newPos > 100) {
      const overshoot = newPos - 100;
      newPos = 100 - overshoot;
    }

    // Cek Menang (Langsung)
    if (newPos === 100) {
      playerPositions[currentPlayer] = 100;
      updatePawnPosition(currentPlayer);
      setTimeout(() => {
        alert(`Pemenangnya adalah ${playerNames[currentPlayer]}!`);
        location.reload();
      }, 800);
      return;
    }

    // Pindahkan bidak ke posisi hasil dadu
    playerPositions[currentPlayer] = newPos;
    updatePawnPosition(currentPlayer);

    // Cek apakah mendarat di Ular/Tangga atau Kotak Biasa
    setTimeout(() => {
      checkSpecialSquaresAndMaybeQuiz();
    }, 800);
  }

  // ===== CEK POSISI & TENTUKAN TIPE KUIS =====
  function checkSpecialSquaresAndMaybeQuiz() {
    const pos = playerPositions[currentPlayer];

    // Cek jika di posisi Ular / Tangga
    if (snakesAndLadders[pos] !== undefined) {
      const destination = snakesAndLadders[pos];

      if (destination > pos) {
        // --- TANGGA ---
        // Aturan: Jawab benar = naik. Salah = diam.
        quizContext = { type: "ladder", targetPosition: destination };
        showQuiz("Pertanyaan Tangga! Jawab benar untuk naik!");
      } else {
        // --- ULAR ---
        // Aturan: Jawab benar = diam (bertahan). Salah = turun.
        quizContext = { type: "snake", targetPosition: destination };
        showQuiz("Awas Ular! Jawab benar agar tidak turun!");
      }
    } else {
      // --- KOTAK BIASA ---
      // REQUEST BARU: Tidak ada kuis.
      // Langsung lanjut ke pemain berikutnya (atau kocok lagi jika dapat 6)
      setTimeout(() => {
        proceedAfterQuizOrNoQuiz();
      }, 500);
    }
  }

  // ===== TAMPILKAN KUIS =====
  function showQuiz(customMessage = "") {
    if (!Array.isArray(questions) || questions.length === 0) {
      // Fallback jika soal kosong
      questions = [{ question: "Contoh Soal", options: ["A"], answer: "A" }];
    }

    const randomQuestion =
      questions[Math.floor(Math.random() * questions.length)];

    // Tampilkan pesan konteks
    if (customMessage) {
      quizQuestionEl.innerHTML = `<small style="color:blue; font-weight:bold;">${customMessage}</small><br><br>${randomQuestion.question}`;
    } else {
      quizQuestionEl.textContent = randomQuestion.question;
    }

    quizOptionsEl.innerHTML = "";
    quizFeedbackEl.innerHTML = "";
    closeFeedbackBtn.style.display = "none";

    randomQuestion.options.forEach((opt) => {
      const btn = document.createElement("button");
      btn.textContent = opt;
      btn.addEventListener("click", () => {
        stopQuizTimer();
        handleAnswerSelection(opt, randomQuestion.answer);
      });
      quizOptionsEl.appendChild(btn);
    });

    quizModal.dataset.correctAnswer = randomQuestion.answer;
    quizModal.classList.add("active");
    startQuizTimer(30);
  }

  // ===== HANDLE JAWABAN (LOGIKA UTAMA DISINI) =====
  function handleAnswerSelection(selectedOption, correctAnswer) {
    quizOptionsEl
      .querySelectorAll("button")
      .forEach((b) => (b.disabled = true));

    const isCorrect = selectedOption === correctAnswer;

    if (isCorrect) {
      // JAWABAN BENAR
      if (quizContext.type === "ladder") {
        // TANGGA: Naik ke target
        playerPositions[currentPlayer] = quizContext.targetPosition;
        updatePawnPosition(currentPlayer);
        quizFeedbackEl.innerHTML = `<span style="color: green;">Benar! Kamu naik tangga!</span>`;
      } else if (quizContext.type === "snake") {
        // ULAR: Bertahan (Diam di mulut ular)
        quizFeedbackEl.innerHTML = `<span style="color: green;">Benar! Kamu berhasil menahan ular!</span>`;
      }
    } else {
      // JAWABAN SALAH / WAKTU HABIS
      const correctMsg = `<br><small>Jawaban: ${correctAnswer}</small>`;

      if (quizContext.type === "ladder") {
        // TANGGA: Gagal naik (Diam di bawah tangga)
        quizFeedbackEl.innerHTML =
          `<span style="color: red;">Salah! Kamu tetap di bawah tangga.</span>` +
          correctMsg;
      } else if (quizContext.type === "snake") {
        // ULAR: Turun ke ekor
        playerPositions[currentPlayer] = quizContext.targetPosition;
        updatePawnPosition(currentPlayer);
        quizFeedbackEl.innerHTML =
          `<span style="color: red;">Salah! Kamu turun digigit ular.</span>` +
          correctMsg;
      }
    }

    closeFeedbackBtn.style.display = "block";
  }

  // Jika waktu habis
  function handleQuizTimeout() {
    const correctAnswer = quizModal.dataset.correctAnswer;
    handleAnswerSelection(null, correctAnswer); // Kirim null biar dianggap salah
    quizFeedbackEl.innerHTML =
      `<span style="color: red;">Waktu Habis!</span>` +
      quizFeedbackEl.innerHTML;
  }

  // Tombol Lanjut
  closeFeedbackBtn.addEventListener("click", () => {
    stopQuizTimer();
    quizModal.classList.remove("active");
    proceedAfterQuizOrNoQuiz();
  });

  // Ganti Giliran / Kocok Lagi
  function proceedAfterQuizOrNoQuiz() {
    if (lastRoll === 6) {
      canRoll = true;
      turnNameEl.textContent = `${playerNames[currentPlayer]} (Kocok Lagi!)`;
    } else {
      switchTurn();
    }
  }

  // Manajemen Giliran
  function switchTurn() {
    currentPlayer = currentPlayer === "player1" ? "player2" : "player1";
    turnNameEl.textContent = playerNames[currentPlayer];
    canRoll = true;
  }

  // Prevent klik dadu saat modal aktif
  document.addEventListener("click", (e) => {
    if (quizModal.classList.contains("active")) {
      if (e.target && e.target.id === "dice") {
        e.stopPropagation();
        e.preventDefault();
      }
    }
  });

  // Posisi Bidak di UI
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
});
