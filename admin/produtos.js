 let produtos = JSON.parse(localStorage.getItem('produtos')) || [];

    function salvarProdutos() {
      localStorage.setItem('produtos', JSON.stringify(produtos));
    }

    function carregarProdutos() {
      const container = document.getElementById('listaProdutos');
      if (produtos.length === 0) {
        container.innerHTML = '<p class="text-gray-500">Nenhum produto cadastrado.</p>';
      } else {
        container.innerHTML = produtos.map((produto, index) => `
          <div class="p-4 bg-gray-100 rounded shadow flex justify-between items-center">
            <div>
              <p class="font-bold">${produto.nome}</p>
              <p class="text-sm text-gray-600">${produto.descricao}</p>
              <p class="text-sm text-gray-600">R$ ${produto.preco.toFixed(2)}</p>
            </div>
            <button onclick="removerProduto(${index})" class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Remover</button>
          </div>
        `).join('');
      }
    }

    function removerProduto(index) {
      produtos.splice(index, 1);
      salvarProdutos();
      carregarProdutos();
    }

    document.getElementById('formProduto').addEventListener('submit', function (e) {
      e.preventDefault();
      const nome = document.getElementById('nome').value;
      const descricao = document.getElementById('descricao').value;
      const preco = parseFloat(document.getElementById('preco').value);
      const imagem = document.getElementById('imagem').value;

      produtos.push({ id: Date.now(), nome, descricao, preco, imagem });
      salvarProdutos();
      carregarProdutos();
      this.reset();
    });

    window.onload = carregarProdutos;