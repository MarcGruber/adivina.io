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


let rooms = {};

io.on("connection", (socket) => {

    socket.emit('preguntes',preguntes)

    console.log('the user '+socket.id+ ' is connected')
    socket.on('message', (msg) => {
        socket.broadcast.emit('msg', msg)
    })

});


httpServer.listen(3000, ()=>
    console.log(`Server listening at http://localhost:3000`)
);

