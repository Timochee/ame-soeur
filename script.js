const prenoms = [
    "Emma", "Louis", "Jade", "Lucas", "Louise", "Hugo",
    "Léa", "Nathan", "Chloé", "Raphaël", "Alice", "Arthur",
    "Manon", "Jules", "Camille", "Théo", "Inès", "Gabriel",
    "Sarah", "Adam", "Léna", "Tom", "Clara", "Noah",
    "Charlotte", "Maxime", "Zoé", "Ethan", "Juliette", "Mathis",
    "Eva", "Axel", "Lina", "Victor", "Anna", "Alexandre",
    "Marie", "Baptiste", "Margot", "Romain", "Pauline", "Antoine",
    "Laura", "Julien", "Romane", "Nicolas", "Célia", "Adrien",
    "Elise", "Bastien"
];

function decouvrir() {
    const prenom = document.getElementById("prenom").value.trim();
    const nom = document.getElementById("nom").value.trim();
    const dob = document.getElementById("dob").value;
    const errorEl = document.getElementById("error");
    const resultEl = document.getElementById("result");
    const resultName = document.getElementById("resultName");

    resultEl.classList.remove("visible");
    errorEl.classList.remove("visible");

    if (!prenom || !nom || !dob) {
        errorEl.classList.add("visible");
        return;
    }

    let chosenName;

    if (
        prenom.toLowerCase() === "gabrielle" &&
        nom.toLowerCase() === "cozza" &&
        dob === "2004-09-06"
    ) {
        chosenName = "Timo";
    } else {
        const seed = (prenom + nom + dob).toLowerCase();
        let hash = 0;
        for (let i = 0; i < seed.length; i++) {
            hash = ((hash << 5) - hash) + seed.charCodeAt(i);
            hash |= 0;
        }
        const index = Math.abs(hash) % prenoms.length;
        chosenName = prenoms[index];
    }

    setTimeout(() => {
        resultName.textContent = chosenName;
        resultEl.classList.add("visible");
    }, 400);
}

document.querySelectorAll("input").forEach(input => {
    input.addEventListener("keydown", e => {
        if (e.key === "Enter") decouvrir();
    });
});
