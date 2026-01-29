async function loadShoppingSummary() {
    const token = localStorage.getItem('token')

    try {
        const response = await fetch('http://localhost:3000/api/shopping/getShopping', {
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

        // Transaction Table
        const shoppingList = data.shopping || []
        if (Array.isArray(shoppingList)) {
            fullOutShoppings(shoppingList)
        }
    }catch(err) {
        console.error("Error loading data:", err)
    }

}

function formatCoin(valor) {
    return Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

async function fullOutShoppings(shoppingList) {
    const tbody = document.querySelector('#tblShoppings tbody')

    if(!tbody) return

    tbody.innerHTML = ''

    if (shoppingList.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" style="text-align:center; color: #888;">None recent Shoppings.</td></tr>'
    }

    let htmlBuffer = ''

    shoppingList.forEach(shopping => {
      const description = shopping.description || 'Sem descrição';
      const store = shopping.store || 'Sem loja';
      
      const dateRaw = shopping.date ? new Date(shopping.date) : new Date();
      const formattedDate = dateRaw.toLocaleDateString('pt-BR');

      const status = shopping.status || 'Indefinido';
        
      const value = (shopping.value !== undefined) ? shopping.value : (shopping.amount || 0);
      const formattedValue = formatCoin(value)

      let statusClass = 'chip'
      //if(status === 'paid') statusClass += ' success'; 

      htmlBuffer += `
        <tr>
          <td>${description}</td>
          <td>${store}</td>
          <td>${formattedDate}</td>
          <td><span class="${statusClass}">${status}</span></td>
          <td>${formattedValue}</td>
        </tr>
        `
    });
    tbody.innerHTML = htmlBuffer
}

document.addEventListener('DOMContentLoaded', loadShoppingSummary);