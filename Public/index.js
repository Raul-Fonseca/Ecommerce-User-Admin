 let produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    if (produtos.length === 0) {
     
      localStorage.setItem('produtos', JSON.stringify(produtos));
    }

    window.addEventListener('storage', (e) => {
  if (e.key === 'produtos') {
    produtos = JSON.parse(e.newValue) || [];
    carregarProdutos();
  }
});



    let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
    let pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];

    // Função para salvar o carrinho no localStorage
    function salvarCarrinho() {
      localStorage.setItem('carrinho', JSON.stringify(carrinho));
    }

    // Carregar os produtos
    function carregarProdutos() {
      const produtosContainer = document.getElementById('produtos');
      produtosContainer.innerHTML = produtos.map(produto => `
        <div class="bg-gray-100 p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
          <img src="${produto.imagem}" alt="${produto.nome}" class="w-full h-48 object-cover rounded mb-4">
          <h3 class="text-xl font-semibold text-blue-600">${produto.nome}</h3>
          <p class="text-sm text-gray-500">${produto.descricao}</p>
          <p class="text-lg font-bold mt-2">R$ ${produto.preco.toFixed(2)}</p>
          <button onclick="adicionarAoCarrinho(${produto.id})" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Adicionar ao Carrinho</button>
        </div>
      `).join('');
    }

    // Adicionar produto ao carrinho
    function adicionarAoCarrinho(id) {
      const produto = produtos.find(item => item.id === id);
      const itemNoCarrinho = carrinho.find(item => item.id === id);

      if (itemNoCarrinho) {
        itemNoCarrinho.quantidade++;
      } else {
        carrinho.push({ ...produto, quantidade: 1 });
      }

      salvarCarrinho();
      carregarCarrinho();
    }

    // Carregar o carrinho de compras
    function carregarCarrinho() {
      const carrinhoContainer = document.getElementById('carrinho');
      if (carrinho.length === 0) {
        carrinhoContainer.innerHTML = '<p class="text-center text-gray-500">Carrinho vazio!</p>';
      } else {
        carrinhoContainer.innerHTML = carrinho.map(item => `
          <div class="flex justify-between items-center p-2 border-b">
            <div>
              <p class="font-semibold">${item.nome} (${item.quantidade}x)</p>
              <p class="text-sm text-gray-500">${item.descricao}</p>
            </div>
            <p class="font-bold">R$ ${(item.preco * item.quantidade).toFixed(2)}</p>
            <button onclick="removerDoCarrinho(${item.id})" class="bg-red-500 text-white px-2 py-1 rounded">Remover</button>
          </div>
        `).join('');
      }

      // Atualizar o total do carrinho
      const total = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
      document.getElementById('totalCarrinho').textContent = total.toFixed(2);
    }

    // Remover item do carrinho
    function removerDoCarrinho(id) {
      carrinho = carrinho.filter(item => item.id !== id);
      salvarCarrinho();
      carregarCarrinho();
    }

    // Finalizar pedido
    function finalizarPedido() {
      if (carrinho.length === 0) {
        alert("Carrinho vazio! Adicione itens.");
        return;
      }
      document.getElementById('modal').classList.remove('hidden');
    }

    // Fechar modal
    function fecharModal() {
      document.getElementById('modal').classList.add('hidden');
    }

    // Confirmar pedido
    function confirmarPedido() {
      const nome = document.getElementById('nome').value;
      const endereco = document.getElementById('endereco').value;
      const dataEntrega = document.getElementById('dataEntrega').value;
      const formaPagamento = document.getElementById('formaPagamento').value;
      const retirarNoLocal = document.getElementById('retirarNoLocal').checked;

      if (!nome || !endereco || !dataEntrega) {
        alert("Por favor, preencha todos os campos.");
        return;
      }

      const pedido = {
        nome,
        endereco,
        dataEntrega,
        formaPagamento,
        retirarNoLocal,
        produtos: carrinho,
        status: 'Aguardando confirmação'
      };

      // Adiciona o pedido ao LocalStorage (site do cliente salva)
      pedidos.push(pedido);
      localStorage.setItem('pedidos', JSON.stringify(pedidos));

      // Limpar carrinho
      carrinho = [];
      salvarCarrinho();
      carregarCarrinho();
      fecharModal();
      alert("Pedido enviado para o administrador!");
    }

   function atualizarStatusPedido(status) {
  document.getElementById('statusPedido').textContent = status;
}


    // Carregar quando a página for carregada
    window.onload = function() {
      carregarProdutos();
      carregarCarrinho();

      // Verificar atualizações de status a cada 2 segundos
      setInterval(() => {
        const pedido = pedidos.find(p => p.status !== 'Entregue');
        if (pedido) {
          atualizarStatusPedido(pedido.status);
        }
      }, 2000);
      setInterval(() => {
  const ultimoPedido = pedidos[pedidos.length - 1];
  if (ultimoPedido) {
    atualizarStatusPedido(ultimoPedido.status);
    mostrarBotaoRecebido(ultimoPedido.status);
  }
}, 1000);

    }
    function mostrarBotaoRecebido(status) {
  const container = document.getElementById('statusPedido');
  if (status === 'Em entrega') {
    if (!document.getElementById('btnRecebido')) {
      const btn = document.createElement('button');
      btn.id = 'btnRecebido';
      btn.className = 'mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 ml-4';
      btn.innerText = 'Pedido Recebido';
      btn.onclick = confirmarRecebimento;
      container.parentNode.appendChild(btn);
    }
  } else {
    const btn = document.getElementById('btnRecebido');
    if (btn) btn.remove();
  }
}
function confirmarRecebimento() {
  const index = pedidos.findIndex(p => p.status !== 'Entregue');
  if (index >= 0) {
    pedidos[index].status = 'Entregue';
    localStorage.setItem('pedidos', JSON.stringify(pedidos));
    atualizarStatusPedido('Pedido entregue. Obrigado!');
    document.getElementById('btnRecebido')?.remove();
  }
}
window.addEventListener('storage', (e) => {
  if (e.key === 'pedidos') {
    pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    const ultimoPedido = pedidos[pedidos.length - 1];
    if (ultimoPedido) {
      atualizarStatusPedido(ultimoPedido.status);
      mostrarBotaoRecebido(ultimoPedido.status);
    }
  }
});