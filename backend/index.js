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

const rooms = {}

let pregunta;
const lanzarPregunta = (intervalID, room) => {
    if (rooms[room].indiceQuiz < preguntes.preguntas.length) {
        rooms[room].pregunta = preguntes.preguntas[rooms[room].indiceQuiz]
        rooms[room].indiceQuiz++
        io.to(room).emit('pregunta', pregunta);
       
     socket.on('respuesta', (respuesta) => {
            const preguntaActual = rooms[room].pregunta;
            if (respuesta === preguntaActual.respuesta) {
              // La respuesta es correcta, hacer algo aquí
              console.log('Respuesta correcta');
            } else {
              // La respuesta es incorrecta, hacer algo aquí
              console.log('Respuesta incorrecta');
            }
          });
    } else {
        clearInterval(intervalID)
    }
}
const corregirRespuestas = () => {
    // responde todas las respuestas
}

try {


    io.on("connection", (socket) => {

        socket.on('createRoom', (callback) => {
            const roomId = new Date().getTime();
            rooms[roomId] = {
                players: [socket],
                gameStarted: false,
                owner: socket.id,
                indiceQuiz: 0,
                pregunta: ''
            };
            socket.join(roomId);
            callback(roomId);
        });

        socket.on('startGame', (room) => {
            if(rooms[room].owner == socket.id){
            if (rooms[room] && !rooms[room].gameStarted) {
                rooms[room].gameStarted = true
                socket.broadcast.emit('gameStarted', true)
                let intervalID = setInterval(() => {
                    lanzarPregunta(intervalID, room)
                    socket.emit('pregunta', rooms[room].pregunta)
                    socket.broadcast.emit('pregunta', rooms[room].pregunta)
                }, 5000);
            }
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

