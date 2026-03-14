const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session management
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

// Authentication middleware
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    }
    res.status(401).send('Unauthorized');
};

// Routes
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    // Placeholder for actual authentication logic
    if (username === 'user' && password === 'password') {
        req.session.user = username;
        return res.send('Login successful');
    }
    res.status(401).send('Invalid credentials');
});

app.get('/api/data', isAuthenticated, (req, res) => {
    res.json({ message: 'This is protected data' });
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Error logging out');
        }
        res.redirect('/');
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});