const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'afaps_secret_key',
    resave: false,
    saveUninitialized: true
}));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'afaps_db'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL Database.');
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
    db.query(query, [username, password], (err, results) => {
        if (err) return res.status(500).json({ success: false, message: 'Database error' });
        if (results.length > 0) {
            req.session.isLoggedIn = true;
            res.json({ success: true });
        } else {
            res.json({ success: false, message: 'ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง' });
        }
    });
});

app.get('/api/yearbooks', (req, res) => {
    const query = 'SELECT * FROM yearbooks ORDER BY class_number ASC';
    db.query(query, (err, results) => {
        if (err) return res.status(500).json({ success: false, message: 'Database error' });
        res.json({ success: true, data: results });
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
