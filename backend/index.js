const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require('cors')
const app = express();
app.use(cors())

const httpServer = createServer(app);

console.log('update')
const io = new Server(httpServer, {
    cors: {
        origin: '*'
    }
});

const rooms = {}

const recuperaPreguntas = (categoria) => {
  let listapreguntas;
  if (categoria === 'pokemon') {
    listapreguntas = require('./json/pokemon.json');
  } else if (categoria === 'barça') {
    listapreguntas = require('./json/barça.json');
  } else {
    listapreguntas = require('./json/react.json');
  }

  return listapreguntas.preguntas;
}

let ranking = []
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
        socket.on('join', ({ username, room, segundos, categoria }) => {
          socket.join(room);
          console.log(username)
          // si el juego no existe, lo creamos con la información necesaria
          if (!games[room]) {
              let listapreguntas = recuperaPreguntas(categoria)
            console.log(segundos, categoria)
            games[room] = {
              users: [username],
              questions: listapreguntas,
              started: false,
              currentQuestionIndex: 0,
              segundos : (segundos * 1000)
            };
          } else {
            // si el juego ya existe, añadimos al usuario a la lista
            games[room].users.push(username);
          }
          io.to(room).emit('usuariosJugando', games[room].users)
          io.to(room).emit('message', {
            username: 'Sistema',
            text: `${username} se unió a la sala`,
          });
        });
      

        socket.on('startGame', (room) => {
          const game = games[room];
          
          if (game && !game.started) {
              game.started = true;
              game.currentQuestionIndex = -1;
              io.to(room).emit('gameStarted', true);

            // aquí se lanza el intervalo para ir enviando las preguntas a los usuarios
            
            const intervalId = setInterval(() => {
              console.log('interval')
              if (game.currentQuestionIndex >= game.questions.length) {
               
                  // Ordenar el ranking por puntuación de mayor a menor
                  const sortedRanking = Object.entries(ranking)
                      .sort((a, b) => b[1].puntuacion - a[1].puntuacion);
              
                      console.log(sortedRanking)
                  // Emitir evento con el ranking ordenado
                  io.to(room).emit('ranking', sortedRanking);
                  ranking = []
                clearInterval(intervalId);

              } else {
                game.currentQuestionIndex++;
                const question = game.questions[game.currentQuestionIndex];
                console.log(question)
                let segundos = game.segundos
                io.to(room).emit('pregunta', {question, segundos});
              }
            }, game.segundos);
            
            
          }
        });

        socket.on('respuesta', ({user,optionNumber, roomId}) => {
          try {
            console.log(ranking)
            const game = games[roomId];
            const preguntaActual = game.questions[game.currentQuestionIndex]
            console.log(preguntaActual)
          console.log(preguntaActual.opciones[optionNumber].correcta)
          if(preguntaActual.opciones[optionNumber].correcta === true ){
              console.log('respuesta correcta')
              if(!ranking[user]){
              ranking[user] = {puntuacion : 0, correctas : 0, incorrectas:0} 
              } else {
                ranking[user].puntuacion += Date.now()+1
                ranking[user].correctas ++ 
              }
              console.log(ranking)
          } else {
            if(!ranking[user]){
              ranking[user] = {puntuacion : 0, correctas : 0, incorrectas:0} 
              } else {
                ranking[user].incorrectas ++ 
              }
            console.log('respuesta incorrecta')
          }
        } catch (error) {
         console.log(error)   
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

