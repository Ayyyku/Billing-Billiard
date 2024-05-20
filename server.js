const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/save-timer', (req, res) => {
    const timerData = req.body;
    const filePath = path.join(__dirname, 'data', 'timers.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err && err.code !== 'ENOENT') {
            return res.status(500).send('Error reading file');
        }

        const timers = data ? JSON.parse(data) : [];
        timers.push(timerData);

        fs.writeFile(filePath, JSON.stringify(timers, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Error saving data');
            }
            res.status(200).send('Timer data saved successfully');
        });
    });
});

app.get('/get-timers', (req, res) => {
    const filePath = path.join(__dirname, 'data', 'timers.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err && err.code !== 'ENOENT') {
            return res.status(500).send('Error reading file');
        }

        const timers = data ? JSON.parse(data) : [];
        res.status(200).json(timers);
    });
});

app.get('/get-daily-summary', (req, res) => {
    const filePath = path.join(__dirname, 'data', 'timers.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err && err.code !== 'ENOENT') {
            return res.status(500).send('Error reading file');
        }

        const timers = data ? JSON.parse(data) : [];
        const dailySummary = {};

        timers.forEach(timer => {
            const date = new Date(timer.timestamp).toISOString().split('T')[0];
            if (!dailySummary[date]) {
                dailySummary[date] = { totalIncome: 0, timers: [] };
            }
            dailySummary[date].totalIncome += timer.price;
            dailySummary[date].timers.push(timer);
        });

        res.status(200).json(dailySummary);
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/rekap', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'rekap.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
