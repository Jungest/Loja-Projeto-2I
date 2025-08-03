document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;

  // =============================
  // PAINEL ADMIN (admin.html)
  // =============================
  if (path.includes("admin.html")) {
    const form = document.getElementById("form-produto");

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const nome = document.getElementById("nome").value;
      const preco = document.getElementById("preco").value;
      const imagem = document.getElementById("imagem").value;
      const categoria = document.getElementById("categoria").value;

      const produto = { nome, preco, imagem, categoria };

      const produtos = JSON.parse(localStorage.getItem("produtos")) || [];
      produtos.push(produto);
      localStorage.setItem("produtos", JSON.stringify(produtos));

      form.reset();
      atualizarListaProdutos();
    });

    function atualizarListaProdutos() {
      const lista = document.getElementById("lista-produtos");
      lista.innerHTML = "";

      const produtos = JSON.parse(localStorage.getItem("produtos")) || [];

      produtos.forEach((produto, index) => {
        const div = document.createElement("div");
        div.innerHTML = `
          <p><strong>${produto.nome}</strong> - ${produto.preco} (${produto.categoria})</p>
          <button onclick="removerProduto(${index})">Remover</button>
          <hr />
        `;
        lista.appendChild(div);
      });
    }

    window.removerProduto = function(index) {
      const produtos = JSON.parse(localStorage.getItem("produtos")) || [];
      produtos.splice(index, 1);
      localStorage.setItem("produtos", JSON.stringify(produtos));
      atualizarListaProdutos();
    };

    atualizarListaProdutos();
  }

  // =============================
  // LOJA (index.html)
  // =============================
  else {
    const produtos = JSON.parse(localStorage.getItem("produtos")) || [];
    const container = document.getElementById("produtos");
    const menu = document.getElementById("menu-categorias");

    if (container && menu) {
      const secoes = {};

      produtos.forEach((prod) => {
        if (!secoes[prod.categoria]) {
          secoes[prod.categoria] = [];
        }
        secoes[prod.categoria].push(prod);
      });

      // Criar botões de categoria
      Object.keys(secoes).forEach((categoria, i) => {
        const botao = document.createElement("button");
        botao.textContent = categoria.toUpperCase();
        botao.onclick = () => exibirCategoria(categoria);
        if (i === 0) botao.classList.add("ativo");
        menu.appendChild(botao);
      });

      // Função para exibir os produtos de uma categoria
      function exibirCategoria(categoriaSelecionada) {
        container.innerHTML = "";

        const botoes = menu.querySelectorAll("button");
        botoes.forEach(btn => btn.classList.remove("ativo"));

        const ativo = [...botoes].find(b => b.textContent.toLowerCase() === categoriaSelecionada.toLowerCase());
        if (ativo) ativo.classList.add("ativo");

        const grid = document.createElement("div");
        grid.classList.add("grid");

        secoes[categoriaSelecionada].forEach((prod) => {
          const card = document.createElement("div");
          card.classList.add("card");
          card.innerHTML = `
            <img src="${prod.imagem}" alt="${prod.nome}">
            <h3>${prod.nome}</h3>
            <p>${prod.preco}</p>
          `;
          grid.appendChild(card);
        });

        container.appendChild(grid);
      }

      // Mostrar a primeira categoria por padrão
      exibirCategoria(Object.keys(secoes)[0]);
    }
  }
});
