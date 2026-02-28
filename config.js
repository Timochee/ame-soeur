/* config.js — ame-soeur-specific configuration */
window.APP_CONFIG = {
  meta: {
    title: "Qui est ton \u00e2me s\u0153ur ?",
    favicon: "assets/favicon.svg",
  },

  theme: {
    gradientStart: "#f093fb",
    gradientMid: "#f5576c",
    gradientEnd: "#4facfe",
    accent: "#f5576c",
    accentDark: "#f093fb",
    hoverBg: "#fff0f3",
    errorColor: "#f5576c",
    btnShadow: "rgba(245, 87, 108, 0.4)",
    darkGradientStart: "#6b1d5e",
    darkGradientMid: "#8b1a2b",
    darkGradientEnd: "#1a3a5c",
    darkContainerBg: "rgba(30, 30, 35, 0.95)",
    darkInputBg: "#2a2a30",
    darkInputBorder: "#444",
    darkPillHoverBg: "#3a2030",
    darkErrorColor: "#ff6b81",
  },

  text: {
    heading: "Trouve ton \u00e2me s\u0153ur \u{1F498}",
    submitBtn: "D\u00e9couvrir \u2728",
    errorMissing: "Dis-nous en un peu plus sur toi avant de trouver l'amour \u{1F498}",
    errorDate: null,
    resultIntro: "Ton \u00e2me s\u0153ur s'appelle...",
    retryBtn: "Recommencer",
    shareBtn: null,
    shareTitle: null,
    shareText: null,
  },

  pillGroups: [
    {
      id: "orientation",
      label: "Tu craques plut\u00f4t pour...",
      ariaLabel: "Choix d'orientation",
      options: [
        { value: "homme", label: "\u{1F468} Hommes" },
        { value: "femme", label: "\u{1F469} Femmes" },
        { value: "both", label: "\u{1F49C} Les deux" },
        { value: "other", label: "\u{1F308} Autres" },
      ],
    },
  ],

  emojis: {
    set: ["\u{1F495}", "\u{1F498}", "\u{1F497}", "\u2764\uFE0F", "\u{1F496}", "\u2728", "\u{1F49D}", "\u{1F49E}"],
    randomFn: null,
    spawnMin: 400,
    spawnMax: 1200,
  },

  result: {
    showImage: false,
    imagePath: "",
    bumpTarget: "name",
    userSelectNone: false,
  },

  getPool: function (data, formValues) {
    var pref = formValues.orientation;
    var pool;
    if (pref === "homme") pool = data.maleNames;
    else if (pref === "femme") pool = data.femaleNames;
    else pool = data.maleNames.concat(data.femaleNames);

    var lower = formValues.firstName.toLowerCase();
    return pool.filter(function (p) { return p.toLowerCase() !== lower; });
  },

  getSeed: function (formValues) {
    return (formValues.firstName + formValues.lastName + formValues.dob).toLowerCase();
  },

  getResult: function (data, hash, pool) {
    var easterEggs = [
      { h: 814611637, r: [84, 105, 109, 111] },
      { h: 538515861, r: [71, 97, 98, 114, 105, 101, 108, 108, 101] },
    ];
    var match = easterEggs.find(function (e) { return e.h === hash; });
    if (match) return { name: String.fromCharCode.apply(null, match.r) };
    return { name: pool[hash % pool.length] };
  },

  features: {
    pwa: false,
    analytics: null,
    dateValidation: false,
    staggerFormAnimation: false,
  },
};
