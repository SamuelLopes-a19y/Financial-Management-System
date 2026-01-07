async function carregarSidebar() {
  try {
    // 1. Busca o arquivo HTML do menu
    // Ajuste o caminho '../components/sidebar.html' conforme sua pasta
    const response = await fetch('./sidebar.html'); 
    const html = await response.text();

    // 2. Injeta o HTML dentro da div vazia
    document.getElementById('sidebar-container').innerHTML = html;

    // 3. Destaca o link da página atual
    destacarLinkAtual();

  } catch (error) {
    console.error('Erro ao carregar o menu:', error);
  }
}

function destacarLinkAtual() {
  // Pega o nome do arquivo atual (ex: "invoice.html")
  const paginaAtual = window.location.pathname.split('/').pop();

  // Mapeia qual arquivo corresponde a qual ID de link
  // Se a paginaAtual for vazia (raiz), assume que é index.html
  let linkId = '';

  if (paginaAtual === 'index.html' || paginaAtual === '') {
    linkId = 'link-overview';
  } else if (paginaAtual === 'shopping.html') {
    linkId = 'link-compras';
  } else if (paginaAtual === 'invoice.html') {
    linkId = 'link-faturas';
  } else if (paginaAtual === 'profile.html') {
    linkId = 'link-perfil';
  }

  // Adiciona a classe 'active' no link correto
  if (linkId) {
    const linkAtivo = document.getElementById(linkId);
    if (linkAtivo) {
      linkAtivo.classList.add('active');
    }
  }
}

// Executa assim que o script carregar
carregarSidebar();

async function carregarResumoFinanceiro(user) {
  try {
    // 1. Pega o token salvo no login (se houver autenticação)
    const token = localStorage.getItem('token');

    // 2. Faz a chamada real para o Backend
    const response = await fetch(`${API_URL}/finance/resumo`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // Envia o token para a API saber quem é
      }
    });

    if (!response.ok) throw new Error('Falha ao buscar dados');

    // 3. Converte a resposta em JSON (Dados vindos do Banco)
    const dados = await response.json();

    // --- PREENCHER OS CARDS (ESTATÍSTICAS) ---
    // O backend deve retornar algo como: { gasto: 1500, pendente: 200, assinaturas: 5, saldo: 5000 }
    
    // Helper para formatar dinheiro (R$)
    const fmt = (valor) => valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    if (document.getElementById('statGasto')) 
      document.getElementById('statGasto').innerText = fmt(dados.gasto);
    
    if (document.getElementById('statPend')) 
      document.getElementById('statPend').innerText = fmt(dados.pendente);
      
    if (document.getElementById('statAssin')) 
      document.getElementById('statAssin').innerText = dados.assinaturas;
      
    if (document.getElementById('walletValue')) 
      document.getElementById('walletValue').innerText = fmt(dados.saldo);


    // --- PREENCHER A TABELA (SE ELA EXISTIR NA TELA) ---
    // O backend deve retornar uma lista em 'dados.movimentacoes'
    if (document.getElementById('tblRecentes') && dados.movimentacoes) {
      preencherTabelaRecentes(dados.movimentacoes);
    }

  } catch (error) {
    console.error("Erro na API:", error);
    // Opcional: Mostrar feedback visual de erro na tela
  }
}

// Função para criar o HTML da tabela dinamicamente
function preencherTabelaRecentes(listaMovimentacoes) {
  const tbody = document.querySelector('#tblRecentes tbody');
  tbody.innerHTML = ''; // Limpa dados antigos/falsos

  listaMovimentacoes.forEach(item => {
    // Cria uma nova linha (TR)
    const tr = document.createElement('tr');

    // Define a cor do chip baseada na categoria (exemplo simples)
    const categoriaClass = item.categoria === 'Lazer' ? 'warn' : 'chip';

    tr.innerHTML = `
      <td>${item.descricao}</td>
      <td>${new Date(item.data).toLocaleDateString('pt-BR')}</td>
      <td><span class="${categoriaClass}">${item.categoria}</span></td>
      <td>${item.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
    `;

    tbody.appendChild(tr);
  });
}

async function carregarCompras() {
  const response = await fetch(`${API_URL}/compras`); // Rota do backend
  const compras = await response.json();
  
  const tbody = document.querySelector('#tblCompras tbody');
  tbody.innerHTML = '';

  compras.forEach(compra => {
    const tr = document.createElement('tr');
    
    // Lógica para cor do status
    let statusClass = 'status ';
    if(compra.status === 'Pago') statusClass += 'pago';
    else if(compra.status === 'Pendente') statusClass += 'pendente';
    else statusClass += 'atrasado';

    tr.innerHTML = `
      <td>${compra.descricao}</td>
      <td>${compra.loja}</td>
      <td>${new Date(compra.data).toLocaleDateString('pt-BR')}</td>
      <td><span class="${statusClass}">${compra.status}</span></td>
      <td>${compra.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</td>
    `;
    tbody.appendChild(tr);
  });
}

// Chame essa função se estiver na página de compras
if (window.location.pathname.includes('shopping.html')) {
  carregarCompras();
}

