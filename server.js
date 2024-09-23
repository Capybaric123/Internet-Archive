// server.js
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// Load posts from JSON file
app.get('/posts', (req, res) => {
    fs.readFile('posts.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading file');
        }
        res.send(JSON.parse(data || '[]'));
    });
});

// Save new post to JSON file
app.post('/posts', (req, res) => {
    const newPost = req.body;
    fs.readFile('posts.json', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading file');
        }
        const posts = JSON.parse(data || '[]');
        posts.push(newPost);
        fs.writeFile('posts.json', JSON.stringify(posts, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Error writing file');
            }
            res.send(newPost);
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
