document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Feedback visual no botão
        const textoOriginal = btn.innerText;
        btn.innerText = 'Verificando...';
        btn.disabled = true;

        try {
            // 2. CHAMA O SERVIDOR PARA VERIFICAR
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            // Se o servidor devolver erro (404 ou 401)
            if (!response.ok) {
                throw new Error('Email ou senha incorretos.');
            }

            // 3. SE SUCESSO: Pega os dados do usuário
            const user = await response.json();

            // 4. SALVA NO NAVEGADOR (Para o index.html saber quem logou)
            localStorage.setItem('demo_id', user.id);
            localStorage.setItem('demo_email', user.email);

            // 5. REDIRECIONA
            window.location.href = '/index.html';

        } catch (err) {
            console.error(err);
            alert(err.message);
            
            // Devolve o botão ao normal
            btn.innerText = textoOriginal;
            btn.disabled = false;
        }
  });
});
