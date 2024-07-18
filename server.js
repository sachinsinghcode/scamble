const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3000;

let winControl = 'random'; // 'win', 'lose', or 'random'

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.post('/set-win-control', (req, res) => {
    winControl = req.body.control;
    res.send({ status: 'success' });
});

app.get('/get-win-control', (req, res) => {
    res.send({ control: winControl });
});

app.post('/reveal-tiles', (req, res) => {
    const { index } = req.body;
    const tiles = Array(30).fill('green');
    let redTilesCount, isWin;

    if (winControl === 'win') {
        isWin = true;
        redTilesCount = Math.floor(Math.random() * 4) + 3; // 3-6 red tiles
    } else if (winControl === 'lose') {
        isWin = false;
        redTilesCount = Math.floor(Math.random() * 4) + 2; // 2-5 red tiles
    } else {
        isWin = Math.random() > 0.5;
        redTilesCount = isWin ? Math.floor(Math.random() * 4) + 3 : Math.floor(Math.random() * 4) + 2;
    }

    const chosenIndexes = new Set();
    chosenIndexes.add(index);

    while (chosenIndexes.size < redTilesCount + 1) {
        chosenIndexes.add(Math.floor(Math.random() * 30));
    }

    chosenIndexes.forEach((i, count) => {
        if (i !== index) {
            tiles[i] = 'red';
        }
    });

    tiles[index] = isWin ? 'green' : 'red';

    res.send({ tiles });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
