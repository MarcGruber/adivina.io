import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { TriviaGame } from './components/game';

const socket = io('http://localhost:3000'); // Establecer la conexión con el servidor de Socket.io

function ChatRoom() {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  useEffect(() => {
    // Escuchar eventos del servidor
    socket.on('message', (message) => {
      setMessages((messages) => [...messages, message]);
    });

    socket.on('gameStarted', (boolean) => {
      setIsGameStarted(boolean);
    });

    socket.on('pregunta', (pregunta) => {
      setCurrentQuestion(pregunta);
      console.log(pregunta.opciones[1])
    });

  }, []);


  const handleJoinRoom = (event) => {
    event.preventDefault();
    console.log(room)
    socket.emit('join', { username, room });
  };

  const handleSendMessage = (event) => {
    event.preventDefault();
    socket.emit('chatMessage', message);
    setMessage('');
  };

  const handleStartGame = (event) => {
    event.preventDefault();
    console.log(room)
    socket.emit('startGame', room);
  };

  const handleAnswerSubmit = (event) => {
    event.preventDefault();
    socket.emit('answer', { answer, room });
    setAnswer('');
  };

  return (
    <div>
      <form onSubmit={handleJoinRoom}>
        <label>
          Nombre de usuario:
          <input
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </label>
        <label>
          Sala:
          <input
            type="text"
            value={room}
            onChange={(event) => setRoom(event.target.value)}
          />
        </label>
        <button type="submit">Unirse a la sala</button>
      </form>

      {isGameStarted ? (
        <>
          {console.log('patata')}
          {
            currentQuestion.pregunta ? <TriviaGame props={{roomId: room, pregunta:currentQuestion}} /> : null
          }
          
          {/* {
            (
            //   <>
            // <h1>
            //   {currentQuestion.pregunta ? currentQuestion.pregunta : ''}
            // </h1>
            // <ul>
            //   <li><button>{currentQuestion.opciones[0].opcion}</button></li>
            //   <li><button>{currentQuestion.opciones[1].opcion}</button></li>
            // </ul>
            // </>
            )


          } */}
        </>
      ) : (
        <button onClick={handleStartGame}>Comenzar juego</button>
      )}

    </div>
  );
}

export default ChatRoom;
