const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require('cors')
const preguntes = require('./json/react.json')
const app = express();
app.use(cors())
const httpServer = createServer(app);


const io = new Server(httpServer, {
    cors : {
        origin: '*'
    }
});


let usuariosConectados = []

let indiceQuiz = 0;
let intervalID = setInterval(() => {
    lanzarPregunta()
}, 10000);
const lanzarPregunta = () => {
    if(indiceQuiz < preguntes.preguntas.length){
    console.log(preguntes.preguntas[indiceQuiz].pregunta)
    indiceQuiz++
    } else {
        clearInterval(intervalID)
    }
}



io.on("connection", (socket) => {
    
    
    console.log('the user '+socket.id+ ' is connected')
    socket.on('name', (name) => {
        usuariosConectados.push({
            name,
            puntuacion : 0
        })
        socket.emit('preguntes',preguntes)
        socket.broadcast.emit('usuarios', usuariosConectados)
        socket.emit('usuarios', usuariosConectados)
        console.log(usuariosConectados)
        // socket.broadcast.emit('msg', msg)
    })


});


httpServer.listen(3000, ()=>
    console.log(`Server listening at http://localhost:3000`)
);

