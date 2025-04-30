import '../state/darkMode.js';
import { createUserWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { auth } from "../config/firebaseConfig.js";


document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("cadastroForm");
  const alertContainer = document.getElementById("alertContainer");
  const emailInput = document.getElementById("email");
  const senhaInput = document.getElementById("senha");
  const confirmarSenhaInput = document.getElementById("confirmarSenha");

  const showAlert = (message, type = "danger") => {
    alertContainer.innerHTML = `
      <div class="alert alert-${type}">
        ${message}
      </div>
    `;
    
    if (type === "success") {
      setTimeout(() => {
        alertContainer.innerHTML = '';
      }, 4000);
    }
  };

  //validação
  const validarCampo = (input, condicao, mensagem) => {
    const feedback = input.nextElementSibling;
    feedback.textContent = condicao ? "" : mensagem;
    input.classList.toggle("is-invalid", !condicao);
    input.classList.toggle("is-valid", condicao); 
    return condicao;
  };

  emailInput.addEventListener("input", () => validarCampo(emailInput, emailInput.value.includes("@"), "Email inválido"));
  senhaInput.addEventListener("input", () => {
    const senhaValida = validarCampo(senhaInput, senhaInput.value.length >= 8, "Mínimo 8 caracteres");
    if (confirmarSenhaInput.value) {
      validarCampo(confirmarSenhaInput, senhaInput.value === confirmarSenhaInput.value, "Senhas não conferem");
    }
    return senhaValida;
  });
  confirmarSenhaInput.addEventListener("input", () => validarCampo(confirmarSenhaInput, senhaInput.value === confirmarSenhaInput.value, "Senhas não conferem"));

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    const senha = senhaInput.value;
    const confirmarSenha = confirmarSenhaInput.value;
    
    const emailValido = validarCampo(emailInput, email.includes("@"), "Email inválido");
    const senhaValida = validarCampo(senhaInput, senha.length >= 8, "Mínimo 8 caracteres");
    const senhasIguais = validarCampo(confirmarSenhaInput, senha === confirmarSenha, "Senhas não conferem");
    
    if (!emailValido || !senhaValida || !senhasIguais) {
      showAlert("Por favor, corrija os erros no formulário antes de continuar.");
      return;
    }

    form.classList.add("is-loading");

    createUserWithEmailAndPassword(auth, email, senha)
      .then(() => {
        return signOut(auth);
      })
      .then(() => {
        showAlert("Cadastro realizado com sucesso! Redirecionando para o login...", "success");
        setTimeout(() => window.location.href = "login.html", 2000);
      })
      .catch((error) => {
        const erros = {
          "auth/email-already-in-use": "Email já cadastrado.",
          "auth/invalid-email": "Email inválido.",
          "auth/weak-password": "Use uma senha de pelo menos 8 caracteres.",
        };
        showAlert(erros[error.code] || "Erro ao cadastrar.");
      })
      .finally(() => {
        form.classList.remove("is-loading");
      });
  });
});