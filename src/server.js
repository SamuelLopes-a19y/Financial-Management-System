const express = require('express');
const Autenticator = require('./Models/Autenticator');

//import Autenticator from '../Models/Autenticator';
const autheticator = new Autenticator()

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Authentication Routes
app.post('/auth/login', (req, res) => {
    const { email, password } = req.body;
    autheticator.authentication()

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password required' });
    }
    
    // TODO: Validate credentials against database
    res.json({ message: 'Login successful', token: 'jwt_token_here' });
});

app.post('/auth/logout', (req, res) => {
    res.json({ message: 'Logout successful' });
});
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Sistema de Gestão Financeira' });
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});