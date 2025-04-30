import '../state/darkMode.js';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { auth, db } from "../config/firebaseConfig.js";
import { Produto } from "../model/produto.js";
import produtoService from "../services/ProdutoService.js";


document.addEventListener("DOMContentLoaded", () => {
  const produtosLista = document.getElementById("produtosLista");
  const produtosTabela = document.getElementById("produtosTabela");
  const loadingDiv = document.getElementById("loading");
  const alertContainer = document.getElementById("alertContainer");
  const userInfoElement = document.getElementById("userInfo");
  const logoutBtn = document.getElementById("logoutBtn");
  const produtoForm = document.getElementById("produtoForm");
  const novoProdutoBtn = document.getElementById("novoProdutoBtn");
  const produtoModal = document.getElementById("produtoModal");
  const modalTitle = document.getElementById("modalAction");
  const produtoIdInput = document.getElementById("produtoId");
  const containerCards = document.getElementById("produtosCards");

  let modoEdicao = false;

  onAuthStateChanged(auth, (user) => {
    if (!user) {
      window.location.href = "login.html";
      return;
    }

    if (userInfoElement) {
      userInfoElement.textContent = user.email;
    }

    carregarProdutos();
  });

  function showAlert(message, type = "danger") {
    const alertHTML = `
      <div class="alert alert-${type} alert-dismissible">
        <span class="alert-message">${message}</span>
        <span class="close-btn" onclick="this.parentElement.remove()">X</span>
      </div>
    `;
    alertContainer.innerHTML = alertHTML;
    setTimeout(() => alertContainer.innerHTML = "", 2000);
  }

  function carregarProdutos() {
    loadingDiv.style.display = "block";
    produtosTabela.style.display = "none";

    produtoService.obterTodos()
      .then(produtos => {
        produtosLista.innerHTML = "";
        loadingDiv.style.display = "none";
        produtosTabela.style.display = "table";

        if (produtos.length === 0) {
          produtosLista.innerHTML = `
            <tr>
              <td colspan="7" class="text-center">Nenhum produto cadastrado</td>
            </tr>
          `;
          return;
        }

        produtos.forEach((produto) => {
          adicionarProdutoNaTabela(produto);
        });
        
        atualizarCards(produtos);
      })
      .catch(error => {
        showAlert("Erro ao carregar produtos: " + error.message);
        loadingDiv.style.display = "none";
      });
  }

  function atualizarCards(produtos) {
    if (!containerCards) return;
    
    containerCards.innerHTML = "";
  
    produtos.forEach(produto => {
      const cardDiv = document.createElement("div");
      cardDiv.className = "card card-produto";
      
      cardDiv.innerHTML = `
        <div class="card-body">
          <h5 class="card-title">${produto.nome}</h5>
          <p class="card-text"><strong>ID:</strong> ${produto.id}</p>
          <p class="card-text">${produto.descricao}</p>
          <p class="card-text"><strong>Preço:</strong> R$ ${produto.preco.toFixed(2)}</p>
          <p class="card-text"><strong>Estoque:</strong> ${produto.estoque}</p>
          <p class="card-text"><strong>Categoria:</strong> ${produto.categoria}</p>
          <div class="btn-container">
            <button class="btn btn-sm btn-primary btn-editar" data-id="${produto.id}">
              <i class="fas fa-edit"></i> Editar
            </button>
            <button class="btn btn-sm btn-danger btn-excluir" data-id="${produto.id}">
              <i class="fas fa-trash"></i> Excluir
            </button>
          </div>
        </div>
      `;
      
      containerCards.appendChild(cardDiv);
  
      const btnEditar = cardDiv.querySelector(".btn-editar");
      btnEditar.addEventListener("click", () => editarProduto(produto.id));
      
      const btnExcluir = cardDiv.querySelector(".btn-excluir");
      btnExcluir.addEventListener("click", () => excluirProduto(produto.id));
    });
  }

  

  function adicionarProdutoNaTabela(produto) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${produto.id}</td>
      <td>${produto.nome}</td>
      <td>${produto.descricao}</td>
      <td>R$${produto.preco.toFixed(2)}</td>
      <td>${produto.estoque}</td>
      <td>${produto.categoria}</td>
      <td>
        <button class="btn btn-sm btn-primary btn-editar me-1" data-id="${produto.id}">
          <i class="fas fa-edit"></i> Editar
        </button>
        <button class="btn btn-sm btn-danger btn-excluir" data-id="${produto.id}">
          <i class="fas fa-trash"></i> Excluir
        </button>
      </td>
    `;

    produtosLista.appendChild(tr);

    const btnExcluir = tr.querySelector(".btn-excluir");
    btnExcluir.addEventListener("click", () => excluirProduto(produto.id));
    
    const btnEditar = tr.querySelector(".btn-editar");
    btnEditar.addEventListener("click", () => editarProduto(produto.id));
  }

  function excluirProduto(id) {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      produtoService.excluirProduto(id)
        .then(() => {
          showAlert("Produto excluído com sucesso!", "success");
          carregarProdutos();
        })
        .catch(error => {
          showAlert("Erro ao excluir produto: " + error.message);
        });
    }
  }

  function editarProduto(id) {
    modoEdicao = true;
    modalTitle.textContent = "Editar";
    
    produtoService.obterProduto(id)
      .then(produto => {
        produtoIdInput.value = produto.id;
        document.getElementById("produtoNome").value = produto.nome;
        document.getElementById("produtoDescricao").value = produto.descricao;
        document.getElementById("produtoPreco").value = produto.preco;
        document.getElementById("produtoEstoque").value = produto.estoque;
        document.getElementById("produtoCategoria").value = produto.categoria;
        
        produtoModal.style.display = "block";
      })
      .catch(error => {
        showAlert("Erro ao carregar dados do produto: " + error.message);
      });
  }
  
  //evento add ou edit produto
  produtoForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const nome = document.getElementById("produtoNome").value;
    const descricao = document.getElementById("produtoDescricao").value;
    const preco = parseFloat(document.getElementById("produtoPreco").value);
    const estoque = parseInt(document.getElementById("produtoEstoque").value);
    const categoria = document.getElementById("produtoCategoria").value;

    if (modoEdicao) {
      //att produto
      const id = produtoIdInput.value;
      const dadosAtualizados = {
        nome: nome,
        descricao: descricao,
        preco: preco,
        estoque: estoque,
        categoria: categoria
      };
      
      produtoService.atualizarProduto(id, dadosAtualizados)
        .then(() => {
          showAlert("Produto atualizado com sucesso!", "success");
          produtoForm.reset();
          produtoModal.style.display = "none";
          carregarProdutos(); 
        })
        .catch(error => {
          showAlert("Erro ao atualizar produto: " + error.message);
        });
    } else {
      const novoProduto = new Produto(null, nome, descricao, preco, estoque, categoria);
      
      produtoService.adicionarProduto(novoProduto)
        .then(() => {
          showAlert("Produto adicionado com sucesso!", "success");
          produtoForm.reset();
          produtoModal.style.display = "none";
          carregarProdutos(); 
        })
        .catch(error => {
          showAlert("Erro ao adicionar produto: " + error.message);
        });
    }
  });

  logoutBtn.addEventListener("click", () => {
    signOut(auth)
      .then(() => {
        window.location.href = "login.html";
      })
      .catch(error => {
        showAlert("Erro ao fazer logout: " + error.message);
      });
  });
  
  //MODAL
  //fecha quando clicka fora do modal
  window.addEventListener("click", (e) => {
    if (e.target === produtoModal) {
      produtoModal.style.display = "none";
    }
  });
  
  //modal novo prod
  novoProdutoBtn.addEventListener("click", () => {
    modoEdicao = false;
    modalTitle.textContent = "Novo";
    produtoForm.reset();
    produtoIdInput.value = "";
    produtoModal.style.display = "block";
  });
  
  // fecha quando clicka no botaum X
  document.querySelector("#produtoModal .close").addEventListener("click", () => {
    produtoModal.style.display = "none";
  });
});

