
async function loadSidebar() {
  try {
    const response = await fetch('./sidebar.html');
    const html = await response.text()
    
    // Injeta o HTML dentro da div vazia
    document.getElementById('sidebar-container').innerHTML = html

    highlightCurrentLink()

  } catch (error) {
    console.error('Error loading sidebar:', error)
  }
}

function highlightCurrentLink() {
  // Pega o nome do arquivo atual na URL
  const currentPage = window.location.pathname.split('/').pop()
  let linkId = ''

  // Define qual link deve ficar ativo baseado no arquivo
  if (currentPage === 'index.html' || currentPage === '') {
    linkId = 'link-overview'
  } else if (currentPage === 'shopping.html') {
    linkId = 'link-shopping'
  } else if (currentPage === 'invoice.html') {
    linkId = 'link-invoice'
  } else if (currentPage === 'profile.html') {
    linkId = 'link-profile'
  }

  // Adiciona a classe active no link correto
  if (linkId) {
    const linkAtivo = document.getElementById(linkId)
    if (linkAtivo) {
      linkAtivo.classList.add('active')
    }
  }
}

loadSidebar()

function formatCoin(valor) {
    return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

async function loadFinancialSummary() {
    const token = localStorage.getItem('token')

    // Se não tiver token, manda de volta para o login
    if (!token) {
        window.location.href = 'login.html'
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/finance/summary', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        // Se o token expirou, desloga o usuário
        if (response.status === 401) {
            localStorage.removeItem('token')
            window.location.href = 'login.html'
            return;
        }

        const data = await response.json()


        // Gasto do mês 
        const elGasto = document.getElementById('spenseValue')
        if (elGasto) {
            // Aceita os gastos
            elGasto.innerText = formatCoin(data.expenses || 0)
        }

        // Faturas Pendentes (
        const elPend = document.getElementById('pendingStatus')
        if (elPend) {
            elPend.innerText = formatCoin(data.pending || 0)
        }

        // Assinaturas Ativas
        const elAssin = document.getElementById('sigStatus')
        if (elAssin) {
            elAssin.innerText = data.subscriptions || "0"
        }

        // Saldo em Carteira 
        const elWallet = document.getElementById('walletValue')
        if (elWallet) {
            elWallet.innerText = formatCoin(data.balance || 0)
        }

        // Transaction Table
        const transactionList = data.transactions || [];
        if (Array.isArray(transactionList)) {
            fullOutRecents(transactionList)
        }

    } catch (err) {
        console.error("Error loading data:", err);

        const elGasto = document.getElementById('spenseValue')
        if(elGasto) elGasto.innerText = "---"
    }
}

async function getUserChip() {
// Implementar o nome do usuário no chip

}
getUserChip()

// Preenche a tabela de transações recentes
function fullOutRecents(shoppingList) {
  const tbody = document.querySelector('#tblRecents tbody')
  
  if (!tbody) return;

  tbody.innerHTML = ''; // Limpa o texto 

  if (shoppingList.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; color: #888;">None recent Transactions.</td></tr>'
      return;
  }

  shoppingList.forEach(shopping => {
    // Tratamento para garantir que não quebre se vier null do banco
    const description = shopping.description || 'No description'
    const dataRaw = shopping.date || new Date()
    const category = shopping.category || 'General'
    const value = shopping.value || shopping.amount || 0

    const formattedDate = new Date(dataRaw).toLocaleDateString('pt-BR')
    const formattedValue = formatCoin(value);

    const tr = `
      <tr>
        <td>${description}</td>
        <td>${formattedDate}</td>
        <td><span class="chip">${category}</span></td>
        <td>${formattedValue}</td>
      </tr>
    `;
    
    tbody.innerHTML += tr
  });
}

// Inicia a função principal ao carregar a página
window.addEventListener('DOMContentLoaded', loadFinancialSummary);