document.addEventListener("DOMContentLoaded", () => {
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

  const isDarkModeEnabled = localStorage.getItem("darkMode") === "enabled";
  applyDarkMode(isDarkModeEnabled);

  darkModeToggle.addEventListener("change", () => {
    applyDarkMode(darkModeToggle.checked);
  });
});
