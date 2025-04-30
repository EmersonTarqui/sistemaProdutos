(function () {
  try {
    const isDarkModeEnabled = localStorage.getItem("darkMode") === "enabled";
    if (isDarkModeEnabled) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  } catch (e) {
    console.error("Erro ao acessar o LocalStorage:", e);
  }
})();
