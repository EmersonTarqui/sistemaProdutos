(function () {
  try {
    const isDarkModeEnabled = localStorage.getItem("darkMode") === "enabled";
    if (isDarkModeEnabled) {
      document.documentElement.classList.add("dark-mode"); 
    } else {
      document.documentElement.classList.remove("dark-mode"); 
    }
  } catch (e) {
    console.error("Erro ao acessar o LocalStorage:", e);
  }
})();

document.addEventListener("DOMContentLoaded", () => {
  try {
    const darkModeToggle = document.getElementById("darkModeToggle");
    const darkModeIcon = document.querySelector(".dark-mode-toggle i");

    const applyDarkMode = (isEnabled) => {
      if (isEnabled) {
        document.documentElement.classList.add("dark-mode"); 
        darkModeIcon.classList.remove("fa-moon");
        darkModeIcon.classList.add("fa-sun");
        localStorage.setItem("darkMode", "enabled");
      } else {
        document.documentElement.classList.remove("dark-mode"); 
        darkModeIcon.classList.remove("fa-sun");
        darkModeIcon.classList.add("fa-moon");
        localStorage.setItem("darkMode", "disabled"); 
      }
    };

    const isDarkModeEnabled = localStorage.getItem("darkMode") === "enabled";
    applyDarkMode(isDarkModeEnabled);

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
