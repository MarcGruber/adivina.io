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
      console.log(pregunta)
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
        <TriviaGame roomId={room} />
        </>
      ) : (
        <button onClick={handleStartGame}>Comenzar juego</button>
      )}

      <div>
        <ul>
          {messages.map((message, index) => (
            <li key={index}>
              {message.username}: {message.text}
            </li>
          ))}
        </ul>
      </div>

      <form onSubmit={handleSendMessage}>
        <input
          type="text"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
        />
        <button type="submit">Enviar mensaje</button>
      </form>
    </div>
  );
}

export default ChatRoom;
