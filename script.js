const prenomsHomme = [
    "Louis", "Lucas", "Hugo", "Nathan", "Raphaël", "Arthur",
    "Jules", "Théo", "Gabriel", "Adam", "Tom", "Noah",
    "Maxime", "Ethan", "Mathis", "Axel", "Victor", "Alexandre",
    "Baptiste", "Romain", "Antoine", "Julien", "Nicolas", "Adrien",
    "Bastien"
];

const prenomsFemme = [
    "Emma", "Jade", "Louise", "Léa", "Chloé", "Alice",
    "Manon", "Camille", "Inès", "Sarah", "Léna", "Clara",
    "Charlotte", "Zoé", "Juliette", "Eva", "Lina", "Anna",
    "Marie", "Margot", "Pauline", "Laura", "Romane", "Célia",
    "Elise"
];

function decouvrir() {
    const prenom = document.getElementById("prenom").value.trim();
    const nom = document.getElementById("nom").value.trim();
    const dob = document.getElementById("dob").value;
    const orientation = document.getElementById("orientation").value;
    const errorEl = document.getElementById("error");
    const resultEl = document.getElementById("result");
    const resultName = document.getElementById("resultName");
    const heartsContainer = document.getElementById("heartsContainer");

    resultEl.classList.remove("visible");
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
        let pool;
        if (orientation === "homme") {
            pool = prenomsHomme;
        } else if (orientation === "femme") {
            pool = prenomsFemme;
        } else {
            pool = prenomsHomme.concat(prenomsFemme);
        }

        const seed = (prenom + nom + dob).toLowerCase();
        let hash = 0;
        for (let i = 0; i < seed.length; i++) {
            hash = ((hash << 5) - hash) + seed.charCodeAt(i);
            hash |= 0;
        }
        const index = Math.abs(hash) % pool.length;
        chosenName = pool[index];
    }

    spawnFloatingHearts();

    setTimeout(() => {
        resultName.textContent = chosenName;
        heartsContainer.innerHTML = '<span>💕</span><span>💘</span><span>💕</span>';
        resultEl.classList.add("visible");

        setTimeout(() => {
            heartsContainer.querySelectorAll("span").forEach(s => s.classList.add("pulse"));
        }, 1200);
    }, 500);
}

function spawnFloatingHearts() {
    const emojis = ["💕", "💘", "💗", "❤️", "💖", "✨"];
    for (let i = 0; i < 15; i++) {
        const heart = document.createElement("div");
        heart.className = "floating-heart";
        heart.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        heart.style.left = Math.random() * 100 + "vw";
        heart.style.bottom = "-40px";
        heart.style.animationDelay = Math.random() * 1.5 + "s";
        heart.style.animationDuration = (2 + Math.random() * 2) + "s";
        heart.style.fontSize = (1 + Math.random() * 1.2) + "rem";
        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 5000);
    }
}

document.querySelectorAll("input, select").forEach(el => {
    el.addEventListener("keydown", e => {
        if (e.key === "Enter") decouvrir();
    });
});
