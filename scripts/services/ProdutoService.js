import { db } from "../config/firebaseConfig.js";
import { produtoConverter } from "../model/produto.js";
import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

class ProdutoService {
  constructor() {

    this.produtosRef = collection(db, "produtos").withConverter(produtoConverter);
  }

  carregarProdutos() {
    console.log("🔄 Carregando produtos...");
    return getDocs(this.produtosRef)
      .then(querySnapshot => {
        return querySnapshot.docs.map(doc => doc.data());
      })
      .catch(error => {
        console.error("❌ Erro ao carregar produtos:", error);
        throw error;
      });
  }

  obterTodos() {
    console.log("🔍 Buscando todos os produtos...");
    return getDocs(this.produtosRef)
      .then(querySnapshot => {
        if (querySnapshot.empty) {
          console.warn("⚠️ Nenhum produto encontrado.");
          return [];
        }
        return querySnapshot.docs.map(doc => doc.data());
      })
      .catch(error => {
        console.error("❌ Erro ao obter todos os produtos:", error);
        throw error;
      });
  }

  adicionarProduto(produto) {
    console.log("➕ Adicionando produto...", produto);
    return addDoc(this.produtosRef, produto)
      .then(docRef => {
        console.log("✅ Produto adicionado com ID:", docRef.id);
        return docRef.id;
      })
      .catch(error => {
        console.error("❌ Erro ao adicionar produto:", error);
        throw error;
      });
  }

  adicionarProdutoComId(id, produto) {
    console.log(`➕ Adicionando produto com ID específico: ${id}`);
    const docRef = doc(db, "produtos", id).withConverter(produtoConverter);
    return setDoc(docRef, produto)
      .then(() => {
        console.log("✅ Produto adicionado com ID específico:", id);
        return id;
      })
      .catch(error => {
        console.error("❌ Erro ao adicionar produto com ID específico:", error);
        throw error;
      });
  }

  obterProduto(id) {
    console.log(`🔎 Buscando produto com ID: ${id}`);
    const docRef = doc(db, "produtos", id).withConverter(produtoConverter);
    return getDoc(docRef)
      .then(docSnap => {
        if (docSnap.exists()) {
          console.log("✅ Produto encontrado:", docSnap.data());
          return docSnap.data();
        } else {
          console.warn("⚠️ Produto não encontrado.");
          throw new Error("Produto não encontrado");
        }
      })
      .catch(error => {
        console.error("❌ Erro ao obter produto:", error);
        throw error;
      });
  }

  atualizarProduto(id, dadosAtualizados) {
    console.log(`♻️ Atualizando produto com ID: ${id}`);
    const docRef = doc(db, "produtos", id);
    return updateDoc(docRef, dadosAtualizados)
      .then(() => {
        console.log("✅ Produto atualizado.");
        return id;
      })
      .catch(error => {
        console.error("❌ Erro ao atualizar produto:", error);
        throw error;
      });
  }

  excluirProduto(id) {
    console.log(`🗑️ Excluindo produto com ID: ${id}`);
    const docRef = doc(db, "produtos", id);
    return deleteDoc(docRef)
      .then(() => {
        console.log("✅ Produto excluído.");
        return true;
      })
      .catch(error => {
        console.error("❌ Erro ao excluir produto:", error);
        throw error;
      });
  }

  criarNovoProdutoRef() {
    return doc(collection(db, "produtos"));
  }
}

const produtoService = new ProdutoService();
export default produtoService;