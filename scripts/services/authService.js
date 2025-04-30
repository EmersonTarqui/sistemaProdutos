import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { auth } from "../config/firebaseConfig.js";

class AuthService {
    registrarUsuario(email, senha) {
        return createUserWithEmailAndPassword(auth, email, senha)
            .then((userCredential) => userCredential.user)
            .catch((error) => {
                console.error("Erro ao registrar usuário:", error.code, error.message);
                throw error;
            });
    }

    fazerLogin(email, senha) {
        return signInWithEmailAndPassword(auth, email, senha)
            .then((userCredential) => userCredential.user)
            .catch((error) => {
                console.error("Erro ao fazer login:", error.code, error.message);
                throw error;
            });
    }

    fazerLogout() {
        return signOut(auth)
            .then(() => {
                console.log("Usuário desconectado com sucesso.");
            })
            .catch((error) => {
                console.error("Erro ao fazer logout:", error.code, error.message);
                throw error;
            });
    }

    verificarAutenticacao(callback) {
        return onAuthStateChanged(auth, callback);
    }
}

export default AuthService;
