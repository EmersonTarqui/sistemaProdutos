import '../state/darkMode.js';
import AuthService from "../services/authService.js";


document.addEventListener("DOMContentLoaded", () => {
  const authService = new AuthService();
  const form = document.getElementById("loginForm");
  const alertContainer = document.getElementById("alertContainer");

  authService.verificarAutenticacao((user) => {
    if (user) {
      showAlert("Você já está logado! Redirecionando...", "success");
      setTimeout(() => {
        window.location.href = "index.html";
      }, 2000);
    }
  });

  function showAlert(message, type = "danger") {
    alertContainer.innerHTML = `
      <div class="alert alert-${type}">
        ${message}
      </div>
    `;
    
    if (type === "success") {
      setTimeout(() => {
        alertContainer.innerHTML = '';
      }, 5000);
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;

    form.classList.add("is-loading");
    
    authService.fazerLogin(email, senha)
      .then(() => {
        showAlert("Login realizado com sucesso! Redirecionando...", "success");
        
        setTimeout(() => {
          window.location.href = "index.html";
        }, 1500);
      })
      .catch((error) => {
        let errorMessage = "Email ou senha incorretos. Tente novamente.";
        
        if (error.code === "auth/too-many-requests") {
          errorMessage = "Muitas tentativas. Tente novamente mais tarde.";
        }

        showAlert(errorMessage);
      })
      .finally(() => {
        form.classList.remove("is-loading");
      });
  });
});