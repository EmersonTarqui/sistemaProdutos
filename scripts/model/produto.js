export class Produto {
    constructor(id, nome, descricao, preco, estoque, categoria) {
      this.id = id;
      this.nome = nome;
      this.descricao = descricao;
      this.preco = preco;
      this.estoque = estoque;
      this.categoria = categoria;
    }
  
    precoFormatado() {
      return `R$ ${this.preco.toFixed(2).replace('.', ',')}`;
    }
  }
  
  export const produtoConverter = {
    toFirestore: (produto) => {
      return {
        nome: produto.nome,
        descricao: produto.descricao,
        preco: produto.preco,
        estoque: produto.estoque,
        categoria: produto.categoria
      };
    },
    fromFirestore: (snapshot, options) => {
      const data = snapshot.data(options);
      return new Produto(
        snapshot.id,
        data.nome,
        data.descricao,
        data.preco,
        data.estoque,
        data.categoria
      );
    }
  };