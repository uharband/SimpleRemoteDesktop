const express = require('express');
const app = express();
const capture = require('./capture');

let port = 8001;

if(process.env.port !== undefined){
    port = process.env.port;
    console.log('port overridden by env to be ' + port);
}
if (process.argv.length > 2) {
    let portFormArgs = parseInt(process.argv[2]);
    if(!isNaN(portFormArgs)) {
        port = portFormArgs;
        console.log('port overridden by args to be ' + port);
    }
}
port = port - 5000;

console.log('server port is ' + port);

app.get('/snapshot', (req, res) => {
    console.log('');
    capture.getSingleFrame();
    res.send('hi');
});


app.listen(port, () => {

    console.log(`app listening at http://localhost:${port}`)
});