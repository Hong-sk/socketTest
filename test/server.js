const http = require('http');
const { Server } = require('ws');
const StompServer = require('stomp-broker-js');

const server = http.createServer((req, res) => {
    res.writeHead(200);
    res.end('WebSocket server is running.');
});

const wss = new Server({ server });

const stompServer = new StompServer({
    server: wss,
    path: '/',
});

stompServer.on('connection', (serverFrame, serverStream) => {
    console.log('STOMP connection established on server');

    serverStream.on('connected', () => {
        console.log('Client connected to STOMP server');
    });

    serverStream.on('message', (message) => {
        const { command, headers, body } = message;
        console.log('STOMP server received a message:', command, headers, body);

        if (command === 'SEND') {
            stompServer.send('/chat/messages', {}, body);
        }
    });

    serverStream.on('error', (error) => {
        console.log('STOMP server error: ', error);
    });
});

wss.on('connection', (ws) => {
    console.log('WebSocket connection established');
});

const PORT = 7999;
server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
