const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require('cors')
const preguntes = require('./json/react.json')
const app = express();
app.use(cors())
const httpServer = createServer(app);


const io = new Server(httpServer, {
    cors: {
        origin: '*'
    }
});

let indiceQuiz = 0;
let pregunta;
const lanzarPregunta = (intervalID) => {
    if (indiceQuiz < preguntes.preguntas.length) {
        pregunta = preguntes.preguntas[indiceQuiz]
        indiceQuiz++
    } else {
        clearInterval(intervalID)
    }
}
const corregirRespuestas = () => {
    // responde todas las respuestas
}

const rooms = {}
try {
    

io.on("connection", (socket) => {

    socket.on('createRoom', (callback) => {
        const roomId = new Date().getTime();
        rooms[roomId] = {
            players: [socket],
            gameStarted: false,
            owner: socket.id
        };
        socket.join(roomId);
        callback(roomId);
    });

    socket.on('startGame', (room) => {
        if (rooms[room] && !rooms[room].gameStarted) {
        rooms[room].gameStarted = true
        let intervalID = setInterval(() => {
            lanzarPregunta(intervalID)
            socket.emit('pregunta', pregunta)
            console.log(pregunta)
            socket.broadcast.emit('pregunta', pregunta)
        }, 10000);
    }
    });

    socket.on('joinRoom', (roomId, username, callback) => {
        try {
            const room = rooms[roomId];

            if (room && !room.gameStarted) {
                room.players.push({ socket: socket, name: username });
                socket.join(roomId);
                callback(true);
            } else {
                callback(false);
            }
        }
        catch (error) {
            console.log(error)
        }
    }
    );
});
} catch (error) {
   console.log(error) 
}

httpServer.listen(3000, () =>
    console.log(`Server listening at http://localhost:3000`)
);

