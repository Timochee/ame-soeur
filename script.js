const prenomsHomme = [
  "Louis",
  "Lucas",
  "Hugo",
  "Nathan",
  "Raphaël",
  "Arthur",
  "Jules",
  "Théo",
  "Gabriel",
  "Adam",
  "Tom",
  "Noah",
  "Maxime",
  "Ethan",
  "Mathis",
  "Axel",
  "Victor",
  "Alexandre",
  "Baptiste",
  "Romain",
  "Antoine",
  "Julien",
  "Nicolas",
  "Adrien",
  "Bastien",
];

const prenomsFemme = [
  "Emma",
  "Jade",
  "Louise",
  "Léa",
  "Chloé",
  "Alice",
  "Manon",
  "Camille",
  "Inès",
  "Sarah",
  "Léna",
  "Clara",
  "Charlotte",
  "Zoé",
  "Juliette",
  "Eva",
  "Lina",
  "Anna",
  "Marie",
  "Margot",
  "Pauline",
  "Laura",
  "Romane",
  "Célia",
  "Elise",
];

const formSection = document.querySelector(".form-section");
const containerEl = document.querySelector(".container");
const heartsLayer = document.getElementById("heartsLayer");
const resultEl = document.getElementById("result");
const resultName = document.getElementById("resultName");
const errorEl = document.getElementById("error");
const prenomInput = document.getElementById("prenom");
const nomInput = document.getElementById("nom");
const dobInput = document.getElementById("dob");
const orientationInput = document.getElementById("orientation");
const pills = document.querySelectorAll(".pill");
const heartEmojis = ["💕", "💘", "💗", "❤️", "💖", "✨", "💝", "💞"];

let heartsRunning = false;
let heartsTimer = null;

pills.forEach((pill) => {
  pill.addEventListener("click", () => {
    pills.forEach((p) => p.classList.remove("active"));
    pill.classList.add("active");
    orientationInput.value = pill.dataset.value;
  });
});

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getPool(orientation) {
  if (orientation === "homme") return prenomsHomme;
  if (orientation === "femme") return prenomsFemme;
  return prenomsHomme.concat(prenomsFemme);
}

function decouvrir() {
  const prenom = prenomInput.value.trim();
  const nom = nomInput.value.trim();
  const dob = dobInput.value;
  const orientation = orientationInput.value;

  errorEl.classList.remove("visible");

  if (!prenom || !nom || !dob || !orientation) {
    errorEl.classList.add("visible");
    return;
  }

  let chosenName;
  const p = prenom.toLowerCase();
  const n = nom.toLowerCase();

  if (p === "gabrielle" && n === "cozza" && dob === "2004-09-06") {
    chosenName = "Timo";
  } else if (p === "timo" && n === "remy" && dob === "2002-02-23") {
    chosenName = "Gabrielle";
  } else {
    const pool = getPool(orientation);
    const seed = (prenom + nom + dob).toLowerCase();
    chosenName = pool[hashString(seed) % pool.length];
  }

  formSection.classList.add("hidden");

  setTimeout(() => {
    resultName.textContent = chosenName;
    resultName.classList.add("revealing");
    resultEl.classList.add("visible");

    burstHearts();

    resultName.addEventListener(
      "animationend",
      () => {
        resultName.classList.remove("revealing");
        startHearts();
      },
      { once: true },
    );
  }, 300);
}

function resetForm() {
  stopHearts();
  resultEl.classList.remove("visible");
  resultName.classList.remove("revealing", "bump");

  prenomInput.value = "";
  nomInput.value = "";
  dobInput.value = "";
  orientationInput.value = "";
  pills.forEach((p) => p.classList.remove("active"));

  heartsLayer.innerHTML = "";
  document.querySelectorAll(".card-heart.flying").forEach((h) => h.remove());

  setTimeout(() => {
    formSection.classList.remove("hidden");
  }, 100);
}

function burstHearts() {
  const cw = containerEl.offsetWidth;
  const ch = containerEl.offsetHeight;
  const cx = cw / 2;
  const cy = ch / 2;
  const maxDim = Math.max(cw, ch);

  for (let i = 0; i < 30; i++) {
    const angle = (Math.PI * 2 * i) / 30 + (Math.random() - 0.5) * 0.4;
    const dist = maxDim * 0.6 + Math.random() * maxDim * 0.5;
    createHeart(cx, cy, angle, dist, Math.random() * 0.3, 2 + Math.random() * 1.5);
  }
}

function startHearts() {
  if (heartsRunning) return;
  heartsRunning = true;
  heartsLoop();
}

function stopHearts() {
  heartsRunning = false;
  clearTimeout(heartsTimer);
}

function heartsLoop() {
  if (!heartsRunning) return;
  spawnHeart();
  heartsTimer = setTimeout(heartsLoop, 400 + Math.random() * 800);
}

function spawnHeart() {
  const cw = containerEl.offsetWidth;
  const ch = containerEl.offsetHeight;
  const cx = cw / 2;
  const cy = ch / 2;
  const maxDim = Math.max(cw, ch);
  const angle = Math.random() * Math.PI * 2;
  const dist = maxDim * 0.7 + Math.random() * maxDim * 0.5;

  createHeart(cx, cy, angle, dist, 0, 6 + Math.random() * 6);
}

function createHeart(cx, cy, angle, dist, delay, duration) {
  const heart = document.createElement("div");
  heart.className = "card-heart";
  heart.textContent =
    heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
  heart.style.left = `${cx}px`;
  heart.style.top = `${cy}px`;
  heart.style.fontSize = `${1.2 + Math.random() * 1.8}rem`;
  heart.style.setProperty("--dx", `${Math.cos(angle) * dist}px`);
  heart.style.setProperty("--dy", `${Math.sin(angle) * dist}px`);
  heart.style.setProperty("--delay", `${delay}s`);
  heart.style.setProperty("--duration", `${duration}s`);

  heart.addEventListener("click", () => {
    if (!resultEl.classList.contains("visible")) return;

    const heartRect = heart.getBoundingClientRect();
    const nameRect = resultName.getBoundingClientRect();
    const targetX = nameRect.left + nameRect.width / 2;
    const targetY = nameRect.top + nameRect.height / 2;

    heart.style.left = `${heartRect.left + heartRect.width / 2}px`;
    heart.style.top = `${heartRect.top + heartRect.height / 2}px`;
    heart.style.opacity = "1";
    heart.style.transform = "translate(-50%, -50%)";
    heart.classList.add("flying");
    document.body.appendChild(heart);

    // Force reflow so the transition starts from the current position
    void heart.offsetWidth;
    heart.style.left = `${targetX}px`;
    heart.style.top = `${targetY}px`;
    heart.style.transform = "translate(-50%, -50%) scale(0)";
    heart.style.opacity = "0";

    setTimeout(() => {
      resultName.classList.remove("bump");
      // Force reflow to restart the bump animation
      void resultName.offsetWidth;
      resultName.classList.add("bump");
    }, 250);

    setTimeout(() => heart.remove(), 450);
  });

  heartsLayer.appendChild(heart);

  const total = (delay + duration) * 1000;
  setTimeout(() => {
    if (heart.parentNode) heart.remove();
  }, total + 500);
}

document.querySelectorAll("input").forEach((el) => {
  el.addEventListener("keydown", (e) => {
    if (e.key === "Enter") decouvrir();
  });
});
