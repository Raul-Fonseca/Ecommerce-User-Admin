  let pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];

    // Função para salvar os pedidos no localStorage
    function salvarPedidos() {
      localStorage.setItem('pedidos', JSON.stringify(pedidos));
    }

  // Carregar pedidos
function carregarPedidos() {
  const pedidosContainer = document.getElementById('pedidos');
  if (pedidos.length === 0 || pedidos.every(p => p.status === 'Entregue' || p.status === 'Negado')) {
    pedidosContainer.innerHTML = '<p class="text-center text-gray-500">Nenhum pedido recebido ainda.</p>';
  } else {
    pedidosContainer.innerHTML = pedidos.map((pedido, index) => `
      ${(pedido.status !== 'Entregue' && pedido.status !== 'Negado') ? `
      <div class="bg-gray-100 p-4 rounded-lg shadow-lg">
        <h3 class="text-xl font-semibold text-blue-600">${pedido.nome}</h3>
        <p class="text-sm text-gray-500">${pedido.endereco}</p>
        <p class="text-sm text-gray-500">Entrega: ${pedido.dataEntrega}</p>
        <p class="text-sm text-gray-500">Forma de pagamento: ${pedido.formaPagamento}</p>
        <h4 class="font-semibold mt-2">Produtos:</h4>
        <ul class="list-disc pl-6">
          ${pedido.produtos.map(item => `<li>${item.nome} (${item.quantidade}x) - R$ ${(item.preco * item.quantidade).toFixed(2)}</li>`).join('')}
        </ul>
        <p class="font-semibold mt-2">Retirar no local: ${pedido.retirarNoLocal ? 'Sim' : 'Não'}</p>
        <div class="flex gap-4 mt-4">
          <button onclick="confirmarPedido(${index})" class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Confirmar</button>
          <button onclick="enviarParaEntrega(${index})" class="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">Sair para Entrega</button>
          <button onclick="negarPedido(${index})" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Negar</button>
        </div>
      </div>
      ` : '' }
    `).join('');
  }
}

function negarPedido(index) {
  if (confirm("Tem certeza que deseja negar este pedido?")) {
    pedidos[index].status = 'Negado';
    salvarPedidos();
    carregarPedidos();
  }
}


    // Confirmar pedido
function confirmarPedido(index) {
  pedidos[index].status = 'Confirmado';
  salvarPedidos();
  carregarPedidos();
}

// Enviar para entrega
function enviarParaEntrega(index) {
  pedidos[index].status = 'Em entrega';
  salvarPedidos();
  carregarPedidos();
}

    // Carregar quando a página for carregada
    window.onload = function() {
      carregarPedidos();
    }
    
    window.addEventListener('storage', (e) => {
  if (e.key === 'pedidos') {
    pedidos = JSON.parse(localStorage.getItem('pedidos')) || [];
    carregarPedidos();
  }
});

  const menuBtn = document.getElementById("menuBtn");
    const mobileMenu = document.getElementById("mobileMenu");

    menuBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });