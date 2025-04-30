(function () {
  try {
    const isDarkModeEnabled = localStorage.getItem("darkMode") === "enabled";
    if (isDarkModeEnabled) {
      document.documentElement.classList.add("dark-mode");
    }
  } catch (e) {
    console.error("Erro ao acessar o LocalStorage:", e);
  }
})();

document.addEventListener("DOMContentLoaded", () => {
  try {
    const isDarkModeEnabled = localStorage.getItem("darkMode") === "enabled";

    if (isDarkModeEnabled) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }

    const darkModeToggle = document.getElementById("darkModeToggle");
    const darkModeIcon = document.querySelector(".dark-mode-toggle i");

    const applyDarkMode = (isEnabled) => {
      if (isEnabled) {
        document.body.classList.add("dark-mode");
        darkModeIcon.classList.remove("fa-moon");
        darkModeIcon.classList.add("fa-sun");
        localStorage.setItem("darkMode", "enabled");
        darkModeToggle.checked = true;
      } else {
        document.body.classList.remove("dark-mode");
        darkModeIcon.classList.remove("fa-sun");
        darkModeIcon.classList.add("fa-moon");
        localStorage.setItem("darkMode", "disabled");
        darkModeToggle.checked = false;
      }
    };

    if (darkModeToggle) {
      darkModeToggle.checked = isDarkModeEnabled;
      darkModeToggle.addEventListener("change", () => {
        applyDarkMode(darkModeToggle.checked);
      });
    }
  } catch (e) {
    console.error("Erro ao acessar o LocalStorage:", e);
  }
});
