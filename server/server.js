const express = require('express');
const app = express();
const capture = require('./capture');

app.get('/', (req, res) => {
        res.send('hi');
});

const port = 3000;

app.listen(port, () => {
    capture.getSingleFrame();
    console.log(`app listening at http://localhost:${port}`)
});