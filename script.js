const formSection = document.querySelector(".form-section");
const containerEl = document.querySelector(".container");
const heartsLayer = document.getElementById("heartsLayer");
const resultEl = document.getElementById("result");
const resultIntro = document.getElementById("resultIntro");
const resultName = document.getElementById("resultName");
const errorEl = document.getElementById("error");
const prenomInput = document.getElementById("prenom");
const nomInput = document.getElementById("nom");
const dobInput = document.getElementById("dob");
const orientationInput = document.getElementById("orientation");
const pills = document.querySelectorAll(".pill");
const btnMain = document.getElementById("btnMain");
const btnRetry = document.getElementById("btnRetry");
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

btnMain.addEventListener("click", decouvrir);
btnRetry.addEventListener("click", resetForm);

document.querySelectorAll("input").forEach((el) => {
  el.addEventListener("keydown", (e) => {
    if (e.key === "Enter") decouvrir();
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

function getPool(orientation, userPrenom) {
  let pool;
  if (orientation === "homme") pool = prenomsHomme;
  else if (orientation === "femme") pool = prenomsFemme;
  else pool = prenomsHomme.concat(prenomsFemme);

  // Filtrer le propre prénom de l'utilisateur
  const lower = userPrenom.toLowerCase();
  return pool.filter((p) => p.toLowerCase() !== lower);
}

function fitNameSize() {
  const container = resultName.parentElement;
  const maxWidth = container.offsetWidth * 0.95;
  let size = parseFloat(getComputedStyle(resultName).fontSize);
  while (resultName.scrollWidth > maxWidth && size > 16) {
    size -= 1;
    resultName.style.fontSize = size + "px";
  }
}

function shuffleNames(pool, finalName, duration, callback) {
  const interval = 70;
  const steps = Math.floor(duration / interval);
  let step = 0;

  // Filtrer les prénoms trop longs pour éviter les sauts pendant la roulette
  const maxLen = Math.max(finalName.length, 8);
  const shortPool = pool.filter((p) => p.length <= maxLen);
  const shufflePool = shortPool.length >= 5 ? shortPool : pool;

  resultName.style.fontSize = "";
  resultName.classList.add("shuffling");

  const timer = setInterval(() => {
    resultName.textContent = shufflePool[Math.floor(Math.random() * shufflePool.length)];
    step++;
    if (step >= steps) {
      clearInterval(timer);
      resultName.classList.remove("shuffling");
      resultName.textContent = finalName;
      resultName.style.fontSize = "";
      fitNameSize();
      callback();
    }
  }, interval);
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
    const pool = getPool(orientation, prenom);
    const seed = (prenom + nom + dob).toLowerCase();
    chosenName = pool[hashString(seed) % pool.length];
  }

  const pool = getPool(orientation, prenom);
  resultName.textContent = pool[Math.floor(Math.random() * pool.length)];

  formSection.classList.add("hidden");
  resultEl.classList.add("visible");

  shuffleNames(pool, chosenName, 1500, () => {
      resultName.classList.add("revealing");
      burstHearts();

      resultName.addEventListener(
        "animationend",
        () => {
          resultName.classList.remove("revealing");
          startHearts();
        },
        { once: true },
      );
    });
}

function resetForm() {
  stopHearts();
  resultEl.classList.remove("visible");
  resultName.classList.remove("revealing", "bump", "shuffling");

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
