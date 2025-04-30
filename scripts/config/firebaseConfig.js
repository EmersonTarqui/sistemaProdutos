import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDV6ZDt7YRcEB73kleIs4BsA939v3_QKqg",
  authDomain: "aulafirebase-f48f9.firebaseapp.com",
  projectId: "aulafirebase-f48f9",
  storageBucket: "aulafirebase-f48f9.firebasestorage.app",
  messagingSenderId: "112448982422",
  appId: "1:112448982422:web:956d4d879edd7f492961b7",
  measurementId: "G-B8WFS8FMZZ"
};

let app, auth, db;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);

  console.log("✅ Firebase inicializado com sucesso!");
} catch (error) {
  console.error("❌ Erro ao inicializar Firebase:", error);
}

function testarConexaoFirestore() {
  console.log("🔍 Testando conexão com Firestore...");

  getDocs(collection(db, "teste"))
    .then((querySnapshot) => {
      if (querySnapshot.empty) {
        console.warn("⚠️ Nenhum documento encontrado na coleção 'teste'.");
      } else {
        querySnapshot.forEach((doc) => {
          console.log(`📄 Documento encontrado: ${doc.id} =>`, doc.data());
        });
        console.log("✅ Conexão com Firestore bem-sucedida!");
      }
    })
    .catch((error) => {
      console.error("❌ Erro ao conectar com Firestore:", error);
    });
}

testarConexaoFirestore();

export { auth, db };
