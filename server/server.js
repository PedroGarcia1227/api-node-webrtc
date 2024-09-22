const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.static(path.join(__dirname, '../public')));

app.get('/stream', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/stream.html'));
});

app.get('/view', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/view.html'));
});

// WebSocket para sinalização WebRTC
io.on('connection', (socket) => {
    console.log('Novo cliente conectado.');

    socket.on('offer', (offer) => {
        console.log('Recebendo oferta...');
        socket.broadcast.emit('offer', offer);
    });

    socket.on('answer', (answer) => {
        console.log('Recebendo resposta...');
        socket.broadcast.emit('answer', answer);
    });

    socket.on('candidate', (candidate) => {
        console.log('Recebendo candidato ICE...');
        socket.broadcast.emit('candidate', candidate);
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado.');
    });
});

server.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
