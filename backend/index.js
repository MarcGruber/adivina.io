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
    } else {
        clearInterval(intervalID)
    }
}
const corregirRespuestas = () => {
    // responde todas las respuestas
}
try {
    
    const usersInRooms = {};
    app.get('/users/:room', (req, res) => {
        const room = req.params.room;
      
        if (!usersInRooms[room]) {
          res.status(404).send('Sala no encontrada');
        } else {
          res.json(usersInRooms[room]);
        }
      });

      const games = {}; // aquí se guardará la información de cada juego

      io.on('connection', (socket) => {
        socket.on('join', ({ username, room }) => {
          socket.join(room);
      
          // si el juego no existe, lo creamos con la información necesaria
          if (!games[room]) {
            games[room] = {
              users: [username],
              questions: preguntes.preguntas,
              started: false,
              currentQuestionIndex: -1,
            };
          } else {
            // si el juego ya existe, añadimos al usuario a la lista
            games[room].users.push(username);
          }
      
          io.to(room).emit('message', {
            username: 'Sistema',
            text: `${username} se unió a la sala`,
          });
        });
      
        socket.on('startGame', (room) => {
          const game = games[room];
      
          if (game && !game.started) {
              game.started = true;
              game.currentQuestionIndex = 0;
              io.to(room).emit('gameStarted', true);
            // aquí se lanza el intervalo para ir enviando las preguntas a los usuarios
            const intervalId = setInterval(() => {
              if (game.currentQuestionIndex >= game.questions.length) {
                clearInterval(intervalId);
              } else {
                const question = game.questions[game.currentQuestionIndex];
                console.log(question)
                io.to(room).emit('pregunta', question);
                game.currentQuestionIndex++;
              }
            }, 5000);
          }
        });
      
        socket.on('disconnect', () => {
          // Eliminar al usuario de la lista de usuarios en la sala al desconectarse
          const rooms = Object.keys(socket.rooms).filter((room) => room !== socket.id);
          rooms.forEach((room) => {
            if (games[room]) {
              games[room].users = games[room].users.filter(
                (username) => username !== socket.username
              );
      
              io.to(room).emit('message', {
                username: 'Sistema',
                text: `${socket.username} abandonó la sala`,
              });
            }
          });
        });
      });
      
} catch (error) {
    console.log(error)
}

httpServer.listen(3000, () =>
    console.log(`Server listening at http://localhost:3000`)
);

