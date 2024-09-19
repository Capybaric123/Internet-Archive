const express = require('express');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

let users = {}; // This would typically be a database

// Registration endpoint
app.post('/register', (req, res) => {
    const { username, email } = req.body;
    users[username] = { email, code: null };
    res.send('User registered!');
});

// Login endpoint
app.post('/login', (req, res) => {
    const { username } = req.body;
    if (users[username]) {
        const code = crypto.randomInt(100000, 999999);
        users[username].code = code;

        // Set up nodemailer
        const transporter = nodemailer.createTransport({ /* SMTP settings */ });
        transporter.sendMail({
            to: users[username].email,
            subject: 'Your Verification Code',
            text: `Your code is: ${code}`
        });

        res.send('Code sent to email!');
    } else {
        res.status(404).send('User not found!');
    }
});

// Code verification endpoint
app.post('/verify', (req, res) => {
    const { username, code } = req.body;
    if (users[username] && users[username].code === Number(code)) {
        res.send('Login successful!');
        users[username].code = null; // Reset code after verification
    } else {
        res.status(403).send('Invalid code!');
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));
