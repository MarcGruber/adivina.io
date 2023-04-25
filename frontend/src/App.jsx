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
  const [activeForm, setActiveForm] = useState('room');

  const handleFormUser = () => {
    setActiveForm('room');
  };

  const handleFormSala = () => {
    setActiveForm('user');
  };
  
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
    });
  }, []);

  const handleJoinRoom = (event) => {
    event.preventDefault();
    console.log(room);
    socket.emit('join', { username, room });
  };

  const handleSendMessage = (event) => {
    event.preventDefault();
    socket.emit('chatMessage', message);
    setMessage('');
  };

  const handleStartGame = (event) => {
    event.preventDefault();
    console.log(room);
    socket.emit('startGame', room);
  };

  const handleAnswerSubmit = (event) => {
    event.preventDefault();
    socket.emit('answer', { answer, room });
    setAnswer('');
  };


  
  socket.on('ranking', ( sortedRanking) => {
    try {
      // Lógica para actualizar el ranking aquí
      // ...
      // Cuando se actualiza el ranking, se envía a los clientes
      console.log(sortedRanking)
      
      

    } catch (error) {
     console.log(error)   
    }
  });

  return (
    <div className="form-container sign-up-container">
      {!isGameStarted ? (
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
          <button type="submit" onClick={handleFormUser}>
            Unirse a la sala
          </button>
        </form>
      ) : null}

      {isGameStarted ? (
        <>
          {console.log('patata')}
          {currentQuestion ? (
            <TriviaGame props={{ roomId: room, pregunta: currentQuestion, user : username }} />
          ) : null}
        </>
      ) : (
        <div className="form-container sign-up-container">
          {activeForm === 'room' ? (
            <div onClick={handleFormSala}>
              <button onClick={handleStartGame}>Comenzar juego</button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default ChatRoom;
