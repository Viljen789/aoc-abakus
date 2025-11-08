require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.get('/api/leaderboard', async (req, res) => {
    try {
        const response = await fetch(
            'https://adventofcode.com/2024/leaderboard/private/view/2579356.json',
            {
                headers: {
                    'Cookie': `session=${process.env.AOC_SESSION_COOKIE}`
                }
            }
        );
        
        if (!response.ok) {
            throw new Error(`AOC API responded with ${response.status}`);
        }
        
        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

app.listen(3001, () => console.log('Proxy server running on port 3001'));
