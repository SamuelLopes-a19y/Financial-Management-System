document.addEventListener('DOMContentLoaded', () => {
    console.log('1. Script carregado');
    
    // Try to get the form element
    const form = document.getElementById('loginForm');
    if (!form) {
        console.error('Formulário "loginForm" não encontrado no HTML!');
        return;
    }

    const btn = form.querySelector('button') || document.querySelector('input[type="submit"]');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        console.log('3. Dados capturados:', { email, password });

        let textoOriginal = 'Acessar';
        if (btn) {
            textoOriginal = btn.innerText;
            btn.innerText = 'Verificando...';
            btn.disabled = true;
        }

        try {
            console.log('Iniciando fetch para o servidor...');
            
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.warn('Login falhou:', errorData);
                throw new Error(errorData.message || 'Erro no servidor (Status ' + response.status + ')');
            }

            const user = await response.json();

            localStorage.setItem('demo_id', user.id);
            localStorage.setItem('demo_email', user.email);
            if (user.token) localStorage.setItem('token', user.token);
            
            // Force redirection to dashboard
            window.location.href = '/overview.html';

        } catch (err) {
            console.error('ERRO CAPTURADO:', err);
            alert('Erro: ' + err.message);

            if (btn) {
                btn.innerText = textoOriginal;
                btn.disabled = false;
            }
        }
    });
});